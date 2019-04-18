import { Router } from 'express';
import filesEndpoints from './endpoints';

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
        this.apiRouter.use('/files', this.router);
    }

    assignEndpoints() {
        filesEndpoints(this.router);
    }
}
