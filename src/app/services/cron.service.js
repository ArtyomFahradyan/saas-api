import moment from 'moment';
import _ from 'lodash';
import { emailFrom } from '../configs/params';

import mongoose from 'mongoose';
const Account = mongoose.model('Account');
const Contract = mongoose.model('Contract');
const User = mongoose.model('User');
const TeamMember = mongoose.model('TeamMember');

import { MailService } from '../services/mail.service';

export class CronService {
    constructor() {}

    static async shouldRemind(renewalDate, today) {
        return moment(today).isSame(renewalDate);
    }

    static async sendByReminder(monthsBefore) {
        const query = [];

        query.push({ $match: { reminder: monthsBefore } },
            { $lookup: { from: 'contracts', localField: '_id', foreignField: 'account', as: 'contracts' } },
            { $unwind: { path: '$contracts', preserveNullAndEmptyArrays: true } },
            { $match: { 'contracts.isDeleted': false } });

        const accounts = await Account.aggregate(query);

        const day = moment().date();
        const month = moment().month() + 1;
        const year = moment().year();
        const today = moment(`${year} ${month} ${day}`, 'YYYY MM DD')
                .add(monthsBefore, 'months')
                .utc(true);

        await accounts.forEach(async account => {
            if(await this.shouldRemind(account.contracts.renewalAt, today)) {
                let sendTo = [];
                let teamQuery = [];
                teamQuery.push({ $match: { $and: [{ team: account.team },{ account: account._id }] } },
                    { $project: { _id: 0, email: 1 } },
                    { $group: { _id: null, emails: { $addToSet: '$email' } } });

                let teamMembers = await TeamMember.aggregate(teamQuery);

                let accountOwner = await User.find({ _id: account.owner });

                let subUsers = await User.aggregate([{ $match: { createdBy: accountOwner[0]._id } },
                    { $project: { _id: 0, email: 1 } },
                    { $group: { _id: null, emails: { $addToSet: '$email' } } }]);

                sendTo.push(...teamMembers[0].emails, accountOwner[0].email, ...subUsers[0].emails);

                sendTo = _.uniq(sendTo);

                // await MailService.sendContractMail(emailFrom, sendTo, '', '');
            }
        });
    }
}
