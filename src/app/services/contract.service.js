import mongoose from 'mongoose';
const Contract = mongoose.model('Contract');
import { ObjectID } from 'bson';
import { NotFound } from '../errors';
import { NOT_EXISTS } from '../configs/constants';

export class ContractService {
    constructor() { }

    static async getUserContracts(accountId, options, user = false) {
        let size = options.size || 10;
        let offset = options.offset || 0;
        let query = [];

        query.push(
            { $match: { account: accountId } },
            { $sort: { createdAt: -1 } }
        );

        if (user) {
            query.push({ $match: { isDeleted: false } });
        }

        query.push(
            { $lookup: { from: 'platforms', localField: 'platform', foreignField: '_id', as: 'platform' } },
            { $unwind: { path: '$platform', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'teams', localField: 'team', foreignField: '_id', as: 'team' } },
            { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
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

        contracts.forEach(contract => {
            sum += contract.price;
        });

        return sum / contracts.length;
    }

    static async getById(_id) {
        return await Contract.findOne({ _id });
    }

    static async create(data) {
        return await Contract.create(data);
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return Contract.findOneAndUpdate({ _id }, attributes, options);
    }

    static async delete(_id) {
        return Contract.deleteOne({ _id });
    }

}
