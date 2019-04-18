import { UsersController } from './users.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {
    router.get('/users', ...middlewares(schemas, 'getAll'), UsersController.getAll);
};
