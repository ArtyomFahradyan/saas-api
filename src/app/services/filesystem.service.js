import mongoose from 'mongoose';
const Filesystem = mongoose.model('Filesystem');
import { BadRequest, NotFound } from '../errors';
import { ALREADY_EXISTS, NOT_EXISTS } from '../configs/constants';

export class FilesystemService {
    constructor() { }

    static async getById(_id) {
        let file = await Filesystem.findOne({ _id });

        if (!file) {
            throw new NotFound(NOT_EXISTS('File'));
        }

        return file;
    }

    static async getAll() {
        return await Filesystem.aggregate([
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { 'user.password': 0 } }
        ]);
    }

    static async create(fileName, user) {
        let data = {
            user: user._id,
            fileName
        };
        return await Filesystem.create(data);
    }

    static async checkUnique(name) {
        let file = await Filesystem.findOne({ fileName: name });

        if (file) {
            throw new BadRequest(ALREADY_EXISTS(`File with ${name} name`));
        }
    }
}
