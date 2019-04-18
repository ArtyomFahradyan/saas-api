import { AccountsController } from './accounts.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {
    router.get('/accounts', ...middlewares(schemas, 'getAccounts'), AccountsController.getAccounts);
    router.get('/accounts/:id', ...middlewares(schemas, 'getOne'), AccountsController.getOne);
};
