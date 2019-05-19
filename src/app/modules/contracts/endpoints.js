import { ContractsController } from './contracts.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.get('/', ...middlewares(schemas, 'getUserContracts'), ContractsController.getUserContracts);
    router.get('/:id', ...middlewares(schemas, 'getOne'), ContractsController.getOne);
    router.get('/renewal/closest', ...middlewares(schemas, 'contract'), ContractsController.getByRenewal);
    // router.get('/:id/average', ...middlewares(schemas, 'getOne'), ContractsController.getContractAndAverage);
    router.patch('/:id', ...middlewares(schemas, 'notify'), ContractsController.notify);
    router.delete('/:id', ...middlewares(schemas, 'delete'), ContractsController.delete);
};
