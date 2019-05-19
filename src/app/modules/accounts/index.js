import { Router } from 'express';
import contractsEndpoints from './endpoints';

export default class UserModule {
    apiRouter;
    router;

    constructor (apiRouter) {
        this.apiRouter = apiRouter;
        this.router = Router();
    }

    createEndpoints() {
        this.assignRouter();
        this.assignEndpoints();
    }

    assignRouter() {
        this.apiRouter.use('/accounts', this.router);
    }

    assignEndpoints() {
        contractsEndpoints(this.router);
    }
}
