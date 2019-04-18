import { PlatformsController } from './platforms.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {
    router.post('/platforms', ...middlewares(schemas, 'addPlatform'), PlatformsController.addPlatform);
    router.get('/platforms', ...middlewares(schemas, 'getPlatforms'), PlatformsController.getPlatforms);
};
