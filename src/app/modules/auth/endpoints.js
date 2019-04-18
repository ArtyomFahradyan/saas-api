import { AuthController } from './auth.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.post('/signup', ...middlewares(schemas, 'signup'), AuthController.signup);
    router.post('/verify', ...middlewares(schemas, 'verify'), AuthController.verify);
    router.post('/login', ...middlewares(schemas, 'login'), AuthController.login);
    router.get('/logout', ...middlewares(schemas, 'logout') , AuthController.logout);
    router.post('/reset-password', ...middlewares(schemas, 'resetPasswordCheckEmail'), AuthController.resetPasswordCheckEmail);
    router.put('/reset-password/:token', ...middlewares(schemas, 'resetPassword'), AuthController.resetPassword);
};
