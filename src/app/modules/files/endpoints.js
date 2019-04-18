import { FilesController } from './files.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.post('/', ...middlewares(schemas, 'upload'), FilesController.upload);
};
