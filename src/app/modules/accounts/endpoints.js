import { AccountsController } from './accounts.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.put('/reminder', ...middlewares(schemas, 'setReminder'), AccountsController.setReminder);
    router.get('/dashboard', ...middlewares(schemas, 'setReminder'), AccountsController.getDashboardData);

    router.patch('/fiscal-year', ...middlewares(schemas, 'fiscalYear'), AccountsController.setFiscalYear);
};
