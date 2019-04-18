import mongoose from 'mongoose';
const Account = mongoose.model('Account');
import moment from 'moment';

export class AccountService {
    constructor() { }

    static async getById(_id) {
        return await Account.findOne({ _id });
    }

    static async create(data) {
        return await Account.create(data);
    }

    static async getAll(options) {
        let query = [];

        query.push(
            { $sort: { createdAt: -1 } },
            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'owner' } },
            { $unwind: '$owner' },
            { $project: { 'owner.password': 0 } },
            { $lookup: { from: 'filesystems', localField: 'attachments', foreignField: '_id', as: 'attachments' } },
            { $lookup: { from: 'teams', localField: 'team', foreignField: '_id', as: 'team' } },
            { $unwind: '$team' },
            { $group: {
                _id: null,
                accounts: { $push: '$$ROOT' },
                count: { $sum: 1 }
            } },
        );

        let size = options.size || 5;
        let offset = options.offset || 0;

        query.push({
            $project: {
                accounts: { $slice: [ '$accounts', offset, size ] },
                count: 1
            }
        });

        let result = await Account.aggregate(query);

        if (result.length) {
            return {
                accounts: result[0].accounts,
                count: result[0].count
            };
        } else {
            return {
                accounts: [],
                count: 0
            };
        }
    }

    static async incOrDecContract(contract, increment = false) {
        let account = await Account.findOne({ _id: contract.account });
        let contractsCount = account.contractsCount;

        const attributes = { contractsCount };

        attributes.contractsCount = increment ? contractsCount + 1 : contractsCount - 1;

        return await this.update(account._id, attributes);
    }

    static async setLastLogin(accountId) {
        const account = await Account.findOne({ _id: accountId });

        const attributes = {
            lastLogin: moment()
        };

        return await this.update(account._id, attributes);
    }

    static async updateAttachments(fileId, user) {
        let attachments;
        const account = await Account.findOne({ owner: user._id });
        if (account.attachments && account.attachments.length) {
            attachments = [ ...account.attachments, fileId ];
        } else {
            attachments = [ fileId ];
        }

        return await this.update(account._id, { attachments });
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return await Account.updateOne({ _id }, attributes, options);
    }
}
