import { Router } from 'express';

import authEndpoints from './auth/endpoints';
import accountEndpoints from './accounts/endpoints';
import filesEndpoints from './files/endpoints';
import contractsEndpoints from './contracts/endpoints';
import teamsEndpoints from './teams/endpoints';
import platformsEndpoints from './platforms/endpoints';
import notificationsEndpoints from './notifications/endpoints';
import usersEndpoints from './users/endpoints';

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
        this.apiRouter.use('/admin', this.router);
    }

    assignEndpoints() {
        authEndpoints(this.router);
        accountEndpoints(this.router);
        filesEndpoints(this.router);
        contractsEndpoints(this.router);
        teamsEndpoints(this.router);
        platformsEndpoints(this.router);
        notificationsEndpoints(this.router);
        usersEndpoints(this.router);
    }
}
