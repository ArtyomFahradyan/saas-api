import { ContractsController } from './contracts.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.get('/', ...middlewares(schemas, 'getUserContracts'), ContractsController.getUserContracts);
    router.get('/:id', ...middlewares(schemas, 'getOne'), ContractsController.getOne);
    router.patch('/:id', ...middlewares(schemas, 'notify'), ContractsController.notify);
};
