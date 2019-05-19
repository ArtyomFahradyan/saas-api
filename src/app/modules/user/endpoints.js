import { UserController } from './user.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.get('/me', ...middlewares(schemas, 'me'), UserController.getUser);
    router.put('/change-password', ...middlewares(schemas, 'changePassword'), UserController.changePassword);
    router.post('/add-user', ...middlewares(schemas, 'addUserCheckEmail'), UserController.addUserCheckEmail);
    router.put('/add-user/:token', ...middlewares(schemas, 'addUser'), UserController.addUser);
    router.delete('/:id', ...middlewares(schemas, 'deleteUser'), UserController.deleteUser);
    router.get('/', ...middlewares(schemas, 'getUsers'), UserController.getUsers);
    router.get('/:id/resend-mail', ...middlewares(schemas, 'getUsers'), UserController.resendMail);
    router.put('/:subUserId', ...middlewares(schemas, 'editUser'), UserController.editUser);

};
