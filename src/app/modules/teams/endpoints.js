import { TeamsController } from './teams.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.get('/', TeamsController.getDefaultTeams);
};
