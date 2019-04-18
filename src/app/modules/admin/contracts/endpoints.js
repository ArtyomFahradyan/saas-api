import { ContractsController } from './contracts.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {
    router.get('/contracts/:id', ...middlewares(schemas, 'getOne'), ContractsController.getOne);
    router.get('/contracts/account/:id', ...middlewares(schemas, 'getByAccount'), ContractsController.getByAccount);
    router.post('/contracts', ...middlewares(schemas, 'addContact'), ContractsController.addContract);
    router.put('/contracts/:id', ...middlewares(schemas, 'editContact'), ContractsController.editContact);
    router.delete('/contracts/:id', ...middlewares(schemas, 'deleteContract'), ContractsController.deleteContract);
};
