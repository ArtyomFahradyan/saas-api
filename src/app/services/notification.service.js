import mongoose from 'mongoose';
const Notification = mongoose.model('Notification');
import { ObjectID } from 'bson';
import { NotFound } from '../errors';
import { NOT_EXISTS } from '../configs/constants';

export class NotificationService {
    static async create(contract) {
        return await Notification.create(contract);
    }

    static async getByParams(params) {
        return await Notification.find(params);
    }

    static async getById(_id) {
        return await Notification.findOne({ _id });
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return await Notification.findOneAndUpdate({ _id }, attributes, options);
    }

    static async getOne(id) {
        const notificationId = new ObjectID(id);

        let result = await Notification.aggregate([
            { $match: { _id: notificationId } },
            { $lookup: { from: 'accounts', localField: 'account', foreignField: '_id', as: 'account' } },
            { $unwind: '$account' },
            { $lookup: { from: 'users', localField: 'account.owner', foreignField: '_id', as: 'account.owner' } },
            { $unwind: '$account.owner' },
            { $project: { 'account.owner.password': 0, 'account.owner.emailVerified': 0, 'account.attachments': 0 } }
        ]);

        if (!result.length) {
            throw new NotFound(NOT_EXISTS('Notification'));
        } else {
            return result[0];
        }
    }

    static async getAll(options) {
        let query = [];

        query.push(
            { $sort: { createdAt: -1 } },
            { $lookup: { from: 'accounts', localField: 'account', foreignField: '_id', as: 'account' } },
            { $unwind: '$account' },
            { $lookup: { from: 'users', localField: 'account.owner', foreignField: '_id', as: 'account.owner' } },
            { $unwind: '$account.owner' },
            { $project: { 'account.owner.password': 0, 'account.owner.emailVerified': 0, 'account.attachments': 0 } },
            { $group: {
                _id: null,
                notifications: { $push: '$$ROOT' },
                count: { $sum: 1 }
            } },
        );

        let size = options.size || 5;
        let offset = options.offset || 0;

        query.push({
            $project: {
                notifications: { $slice: [ '$notifications', offset, size ] },
                count: 1
            }
        });

        let result = await Notification.aggregate(query);

        if (result.length) {
            return {
                notifications: result[0].notifications,
                count: result[0].count
            };
        } else {
            return {
                notifications: [],
                count: 0
            };
        }
    }

    static async delete(_id) {
        return await Notification.findOneAndDelete({ _id });
    }
}
