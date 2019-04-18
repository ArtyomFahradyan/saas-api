import { PlatformService } from '../../../services';
import { SUCCESS_CODE } from '../../../configs/status-codes';

export class PlatformsController {
    static async getPlatforms(req, res, next) {
        try {
            const platforms = await PlatformService.getPlatforms();

            return res.status(SUCCESS_CODE).json(platforms);
        } catch(err) {
            next(err);
        }
    }

    static async addPlatform(req, res, next) {
        const { name } = req.body;
        try {
            const data = {
                name,
                isCustom: true
            };

            const teams = await PlatformService.create(data);

            return res.status(SUCCESS_CODE).json(teams);
        } catch(err) {
            next(err);
        }
    }
}
