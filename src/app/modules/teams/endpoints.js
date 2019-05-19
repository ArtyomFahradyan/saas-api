import { TeamsController } from './teams.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.post('/', ...middlewares(schemas, 'addTeam'), TeamsController.addTeam);
    router.get('/account/:id', ...middlewares(schemas, 'getByAccount'), TeamsController.getByAccount);
    router.delete('/:id', ...middlewares(schemas, 'delete'), TeamsController.deleteTeam);
    router.get('/', TeamsController.getDefaultTeams);
};
