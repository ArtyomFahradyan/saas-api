import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../configs/status-codes';
import { AccountService, TeamService } from '../../services';
import { Forbidden, NotFound } from '../../errors';
import { NOT_EXISTS } from '../../configs/constants';

export class TeamsController {
    static async getDefaultTeams(req, res, next) {
        try {
            const teams = await TeamService.getDefaultTeams();

            return res.status(SUCCESS_CODE).json(teams);
        } catch (err) {
            next(err);
        }
    }

    static async addTeam(req, res, next) {
        const { name } = req.body;
        try {
            if (!req.user.isAccountOwner) {
                throw new Forbidden();
            }

            const data = {
                name,
                isCustom: true,
                account: req.user.account
            };

            const team = await TeamService.create(data);

            return res.status(SUCCESS_CODE).json(team);
        } catch (err) {
            next(err);
        }
    }

    static async deleteTeam(req, res, next) {
        const { id } = req.params;
        try {
            if (!req.user.isAccountOwner) {
                throw new Forbidden();
            }

            const team = await TeamService.getById(id);

            if (!team) {
                throw new NotFound(NOT_EXISTS('Team'));
            }

            await TeamService.delete(team._id);

            return res.status(NO_CONTENT_CODE).json({});
        } catch (err) {
            next(err);
        }
    }

    static async getByAccount(req, res, next) {
        const { id } = req.params;
        try {
            const account = await AccountService.getById(id);

            if (!account) {
                throw new NotFound(NOT_EXISTS('Account'));
            }

            const teams = await TeamService.getByAccountId(account._id);

            return res.status(SUCCESS_CODE).json(teams);
        } catch (err) {
            next(err);
        }
    }
}
