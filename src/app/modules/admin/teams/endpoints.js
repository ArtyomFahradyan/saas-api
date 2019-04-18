import { TeamsController } from './teams.controller';
import middlewares from '../../../middlewares';
import schemas from './schemas';

export default (router) => {
    router.post('/teams', ...middlewares(schemas, 'addTeam'), TeamsController.addTeam);
    router.get('/teams/:account', ...middlewares(schemas, 'teams'), TeamsController.getTeams);
};
