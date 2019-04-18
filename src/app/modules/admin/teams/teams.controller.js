import { TeamService } from '../../../services';
import { SUCCESS_CODE } from '../../../configs/status-codes';

export class TeamsController {
    static async getTeams(req, res, next) {
        const { account } = req.params;
        try {
            const teams = await TeamService.getTeams(account);

            return res.status(SUCCESS_CODE).json(teams);
        } catch(err) {
            next(err);
        }
    }

    static async addTeam(req, res, next) {
        const { account, name } = req.body;
        try {
            const data = {
                account,
                name,
                custom: true
            };

            const teams = await TeamService.create(data);

            return res.status(SUCCESS_CODE).json(teams);
        } catch(err) {
            next(err);
        }
    }
}
