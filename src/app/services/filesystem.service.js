import mongoose from 'mongoose';
const Filesystem = mongoose.model('Filesystem');
import { NotFound } from '../errors';
import { NOT_EXISTS } from '../configs/constants';

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
            { $lookup: { from: 'accounts', localField: 'account', foreignField: '_id', as: 'account' } },
            { $unwind: '$account' }
        ]);
    }

    static async getByAccountAndContract(contract, account) {
        return await Filesystem.findOne({ contract, account });
    }

    static async getByFileName(fileName, account) {
        return await Filesystem.findOne({ fileName, account });
    }

    static async getByAccount(account) {
        return await Filesystem.find({ account });
    }

    static async create(data) {
        return await Filesystem.create(data);
    }

    static async getByContract(contract) {
        return await Filesystem.find({ contract });
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return await Filesystem.findOneAndUpdate({ _id }, attributes, options);
    }

    static async isValidFileName(fileName) {
        let rg1 = /^[^\\/:\*\?"<>\|]+$/;
        let rg2 = /^\./;
        let rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i;

        return rg1.test(fileName) && !rg2.test(fileName) && !rg3.test(fileName);
    }
}
