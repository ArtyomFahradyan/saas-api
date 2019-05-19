import mongoose from 'mongoose';
const Contract = mongoose.model('Contract');
import { ObjectID } from 'bson';
import { NotFound } from '../errors';
import { NOT_EXISTS } from '../configs/constants';
import Utils from '../helpers/utils';
import moment from 'moment';
import { TransactionService } from './transaction.service';

export class ContractService {
    constructor() { }

    static search(query, options) {
        options.q = Utils.escapeRegexSpecialCharacters(options.q);

        query.push({
            $match: { 'platform.name': new RegExp(options.q, 'i')  }
        });
    }

    static sort(query, options) {
        switch (options.sort) {
                case 'name':
                    if (options.dir === 'asc') {
                        query.push({ $sort: { 'platform.name': 1 } });
                    } else if (options.dir === 'desc') {
                        query.push({ $sort: { 'platform.name': -1 } });
                    }
                    break;
                case 'date':
                    if (options.dir === 'asc') {
                        query.push({ $sort: { renewalAt: 1 } });
                    } else if (options.dir === 'desc') {
                        query.push({ $sort: { renewalAt: -1 } });
                    }
                    break;
        }
    }

    static async getUserContracts(accountId, options, user = false) {
        let size = options.size || 10;
        let offset = options.offset || 0;
        let query = [];

        if (user) {
            query.push({ $match: { isDeleted: false } });
        }

        query.push(
            { $match: { account: accountId } },
            { $sort: { createdAt: -1 } },
            { $lookup: { from: 'platforms', localField: 'platform', foreignField: '_id', as: 'platform' } },
            { $unwind: { path: '$platform', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'teams', localField: 'team', foreignField: '_id', as: 'team' } },
            { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
        );

        if (options.sort && options.dir) {
            this.sort(query, options);
        }

        if (options.q) {
            this.search(query, options);
        }

        query.push(
            { $group: { _id: null, contracts: { $push: '$$ROOT' }, count: { $sum: 1 } } },
            { $project: { contracts: { $slice: [ '$contracts', offset, size ] },
                count: 1, avgSmallPrice: 1, avgMediumPrice: 1, avgLargePrice: 1, _id: 0 } }
        );

        let result = await Contract.aggregate(query);

        if (result.length) {
            return {
                contracts: result[0].contracts,
                count: result[0].count,
            };
        } else {
            return {
                contracts: [],
                count: 0,
            };
        }
    }

    static async getAllContractsByAccount(account) {
        return await Contract.find({ account });
    }

    static async getOne(id) {
        const contractId = new ObjectID(id);

        let result = await Contract.aggregate([
            { $match: { _id: contractId } },
            { $lookup: { from: 'platforms', localField: 'platform', foreignField: '_id', as: 'platform' } },
            { $unwind: { path: '$platform', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'teams', localField: 'team', foreignField: '_id', as: 'team' } },
            { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } }
        ]);

        if (!result.length) {
            throw new NotFound(NOT_EXISTS('Contract'));
        }

        return result[0];
    }

    static async averageByPlatform(platform, usage) {
        let sum = 0;
        const contracts = await Contract.find({ platform, isDeleted: false, usage });

        if (contracts.length) {
            contracts.forEach(contract => {
                sum += contract.price;
            });

            return sum / contracts.length;
        } else {
            return 0;
        }
    }

    static async getById(_id) {
        return await Contract.findOne({ _id });
    }

    static async getByRenewal(user) {
        return await Contract.aggregate([
            { $match: { account: user.account } },
            { $sort: { renewalAt: -1 } },
            { $limit: 5 }
        ]);
    }

    static async create(data) {
        return await Contract.create(data);
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return await Contract.findOneAndUpdate({ _id }, attributes, options);
    }

    static async delete(_id) {
        return Contract.deleteOne({ _id });
    }

    static async getEachPayment(_id) {
        const contract = await Contract.findOne({ _id });

        let frequency;

        switch(contract.paymentFrequency) {
                case 'Monthly':
                    frequency = 1;
                    break;
                case 'Quarterly':
                    frequency = 3;
                    break;
                case 'Semi-Annually':
                    frequency = 6;
                    break;
                case 'Annually':
                    frequency = 12;
        }

        const dates = [];
        let date = moment(contract.startedAt).add(contract.paymentTerms, 'days');
        const endDate = moment(contract.endedAt);

        while(date <= endDate) {
            dates.push(moment(date));
            date.add(frequency, 'months');
        }

        let cost = contract.price / dates.length;

        return { dates, cost };
    }

}
