import { FilesController } from './files.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {
    router.get('/files', ...middlewares(schemas, 'getFiles'), FilesController.getFiles);
    router.get('/files/download/:id', ...middlewares(schemas, 'download'), FilesController.download);
};
