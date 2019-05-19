import { TeamMemberController } from './teamMember.controller';
import middlewares from '../../middlewares/index';
import schemas from './schemas';

export default (router) => {
    router.post('/', ...middlewares(schemas, 'addTeamMember'), TeamMemberController.addTeamMember);
    router.get('/team/:teamId', ...middlewares(schemas, 'getAllByAccount'), TeamMemberController.getAllByAccount);
    router.get('/:id', ...middlewares(schemas, 'getOne'), TeamMemberController.getOne);
    router.put('/:id', ...middlewares(schemas, 'addTeamMember'), TeamMemberController.edit);
    router.delete('/:id', ...middlewares(schemas, 'delete'), TeamMemberController.delete);
};
