import { SUCCESS_CODE } from '../../configs/status-codes';
import { TeamService } from '../../services';

export class TeamsController {
    static async getDefaultTeams(req, res, next) {
        try {
            const teams = await TeamService.getDefaultTeams();

            return res.status(SUCCESS_CODE).json(teams);
        } catch (err) {
            next(err);
        }
    }
}
