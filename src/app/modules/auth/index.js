import { Router } from 'express';
import authEndpoints from './endpoints';

export default class AdminModule {
    apiRouter;
    router;

    constructor(apiRouter) {
        this.apiRouter = apiRouter;
        this.router = Router();
    }

    createEndpoints() {
        this.assignRouter();
        this.assignEndpoints();
    }

    assignRouter() {
        this.apiRouter.use('/auth', this.router);
    }

    assignEndpoints() {
        authEndpoints(this.router);
    }
}
