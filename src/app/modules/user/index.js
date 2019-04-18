import { Router } from 'express';
import authEndpoints from './endpoints';

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
        this.apiRouter.use('/users', this.router);
    }

    assignEndpoints() {
        authEndpoints(this.router);
    }
}
