import { FilesController } from './files.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.post('/', ...middlewares(schemas, 'upload'), FilesController.upload);
    router.get('/account/:id', ...middlewares(schemas, 'getAll'), FilesController.getByAccount);
    router.get('/:id', ...middlewares(schemas, 'download'), FilesController.getDownloadLink);
};
