import { FilesController } from './files.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {
    router.get('/files', ...middlewares(schemas, 'adminAuth'), FilesController.getFiles);
    router.get('/files/account/:id', ...middlewares(schemas, 'adminAuth'), FilesController.getFilesByAccount);

    router.patch('/files/rename/:id', ...middlewares(schemas, 'adminAuth'), FilesController.renameFile);
};
