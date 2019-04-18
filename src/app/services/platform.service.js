import mongoose from 'mongoose';
const Platform = mongoose.model('Platform');
import { ContractService } from './contract.service';
import Utils from '../helpers/utils';

export class PlatformService {
    constructor() { }

    static async create(data) {
        return await Platform.create(data);
    }

    static async getPlatforms() {
        return await Platform.find()
                .collation({ locale: 'en' })
                .sort({ name: 1 });
    }

    static async getDefaultPlatforms() {
        return await Platform.find({ isCustom: false });
    }

    static async updateAveragePrice(_id, usage) {

        const avg = await ContractService.averageByPlatform(_id, usage);

        let updateData = Utils.checkUsage(usage, avg);

        return await this.update(_id, updateData);
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return await Platform.findOneAndUpdate({ _id }, attributes, options);
    }

}
