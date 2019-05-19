import mongoose from 'mongoose';
const Account = mongoose.model('Account');
const Contract = mongoose.model('Contract');
import moment from 'moment';
import { NotFound } from '../errors';
import { NOT_EXISTS } from '../configs/constants';
import { UserService } from './user.service';
import { ContractService } from './contract.service';

export class AccountService {
    constructor() { }

    static async getById(_id) {
        return await Account.findOne({ _id });
    }

    static async getByCompany(company) {
        return await Account.findOne({ company });
    }

    static async getFilesByAccount(account) {
        let result = await Account.aggregate([
            { $match: { _id: account } },
            { $lookup: { from: 'filesystems', localField: 'attachments', foreignField: '_id', as: 'attachments' } }
        ]);

        if (result.length) {
            return result[0];
        } else {
            throw new NotFound(NOT_EXISTS('Account'));
        }
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
        console.log(user);
        let attachments = [], exists = false, account;
        if (user.isAccountOwner) {
            account = await Account.findOne({ owner: user._id });
        } else {
            account = await this.getById(user.account);
        }

        if (account.attachments && account.attachments.length) {
            account.attachments.forEach((attachment) => {
                if (attachment.toString() === fileId.toString()) {
                    exists = true;
                }
            });
        }

        if (account.attachments && account.attachments.length && !exists) {
            attachments = [ ...account.attachments, fileId ];
        } else {
            attachments = [ fileId ];
        }

        if (attachments && attachments.length) {
            return await this.update(account._id, { attachments });
        }
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return await Account.updateOne({ _id }, attributes, options);
    }

    static async getDashboardData(account, offset = 0) {
        let query = [];
        let transactionQuery = [];
        const emptyObject = {
            summary: {
                contractsCount: 0,
                annualSpend: 0
            },
            renewals: [],
            chart: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            monthlySummary: []
        };

        query.push(
            { $match: { _id: account } },
        );

        let accountArray = await Account.aggregate(query);

        const year = moment().year();
        const month = accountArray[0].fiscalYearStartAt;
        const day = 1;

        if(!month) {
            return emptyObject;
        }

        const fiscalStartDate = moment(`${year} ${day} ${month}`, 'YYYY DD MM').add(offset, 'years')
                .utc(true);

        transactionQuery.push(
            { $match: { account: account } },
            { $match: { isDeleted: false } },
            { $lookup: { from: 'transactions', localField: '_id', foreignField: 'contract', as: 'transactions' } },
            { $unwind: '$transactions' },
            { $unwind: '$transactions.paymentDate' },
            { $replaceRoot: { newRoot: '$transactions' } }
        );

        let payments = await  Contract.aggregate(transactionQuery);

        const months = [];

        const monthlyCosts = [];
        const monthlySummary = [];
        for(let i = 0; i < 12; ++i) {
            monthlyCosts.push([]);
            monthlySummary.push(0);
        }

        let date = moment(fiscalStartDate);

        for (let i = 0; i < 13; ++i) {
            months.push(moment(date));
            await date.add(1, 'months');
        }
        let annualSpend = 0;

        payments.forEach( payment => {
            for(let i = 0; i < 12; ++i) {
                if (moment(payment.paymentDate)
                        .isSameOrAfter(months[i]) &&
                    moment(payment.paymentDate)
                            .isBefore(months[i + 1])) {

                    monthlySummary[i] += payment.cost;
                    annualSpend += payment.cost;

                    if ( monthlyCosts[i].find((obj, index) => {
                        if (obj.name === payment.platformName) {
                            monthlyCosts[i][index].cost += payment.cost;

                            return true;
                        }
                    }) ) {
                        break;
                    } else {
                        monthlyCosts[i].push({
                            name: payment.platformName,
                            cost: payment.cost
                        });
                    }
                    break;
                }
            }
        });

        query.push(
            { $lookup: { from: 'contracts', localField: '_id', foreignField: 'account', as: 'contracts' } },
            { $unwind: '$contracts' },
            { $match: { 'contracts.isDeleted': false } }
        );

        const contracts = await  Account.aggregate(query);
        let renewal = query.slice();

        renewal.push(
            { $sort: { 'contracts.renewalAt': -1 } },
            { $limit: 5 },
            { $lookup: { from: 'teams', localField: 'contracts.team', foreignField: '_id', as: 'contracts.team' } },
            { $unwind: { path: '$contracts.team', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'platforms', localField: 'contracts.platform', foreignField: '_id', as: 'contracts.platform' } },
            { $unwind: { path: '$contracts.platform', preserveNullAndEmptyArrays: true } },
            { $group: { _id: null, contracts: { $addToSet: '$contracts' } } },
            { $project: { _id: 0 } }
        );

        let renewals = await Account.aggregate(renewal);

        if (renewals.length) {
            return {
                summary: {
                    contractsCount: contracts.length,
                    annualSpend
                },
                renewals: renewals[0].contracts,
                chart: monthlyCosts,
                monthlySummary
            };
        } else {
            return emptyObject;
        }
    }
}
