import { AuthController } from './auth.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {

    router.post('/login', ...middlewares(schemas, 'login'), AuthController.login);
    router.get('/logout', ...middlewares(schemas, 'logout'), AuthController.logout);
    router.get('/me', ...middlewares(schemas, 'getAdmin'), AuthController.getAdmin);
    
};
