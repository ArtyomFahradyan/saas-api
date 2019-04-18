import { NotificationController } from './notification.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {
    router.get('/notifications', ...middlewares(schemas, 'getAll'), NotificationController.getAll);
    router.get('/notifications/:id', ...middlewares(schemas, 'getOne'), NotificationController.getOne);
    router.get('/notifications/:id/seen', ...middlewares(schemas, 'setAsSeen'), NotificationController.setAsSeen);
    router.delete('/notifications/:id', ...middlewares(schemas, 'delete'), NotificationController.delete);
};
