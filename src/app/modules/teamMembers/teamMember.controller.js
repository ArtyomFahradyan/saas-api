import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../configs/status-codes';
import { TeamMemberService } from '../../services';
import { ObjectID } from 'bson';
import Handlers from '../../helpers/handlers';
import { BadRequest } from '../../errors';
import { ALREADY_EXISTS, NOT_EXISTS } from '../../configs/constants';

export class TeamMemberController {
    static async addTeamMember(req, res, next) {
        const payload = req.body;
        try {
            const member = await TeamMemberService.findByEmail(payload.email, payload.team);

            if(member) {
                throw new BadRequest(ALREADY_EXISTS('Email'));
            }

            const data = {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                team: payload.team,
                account: req.user.account
            };

            const teamMember = await TeamMemberService.create(data);

            return res.status(SUCCESS_CODE).json(teamMember);
        } catch (err) {
            next(err);
        }
    }

    static async edit(req, res, next) {
        const payload = req.body;
        const { id } = req.params;
        try {
            const member = await TeamMemberService.getById(id);

            if(!member) {
                throw new BadRequest(NOT_EXISTS('Team Member'));
            }

            const memberByEmail = await TeamMemberService.findByEmail(payload.email, payload.team);

            if(memberByEmail && member._id.toString() !== memberByEmail._id.toString()) {
                throw new BadRequest(ALREADY_EXISTS('Email'));
            }

            const data = {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                team: payload.team,
                account: req.user.account
            };

            const result = await TeamMemberService.edit(id, data);

            return res.status(SUCCESS_CODE).json(result);
        } catch (err) {
            next(err);
        }
    }

    static async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const member = await TeamMemberService.getById(id);

            return res.status(SUCCESS_CODE).json(member);
        } catch (err) {
            next(err);
        }
    }

    static async getAllByAccount(req, res, next) {
        const { teamId } = req.params;
        const query = req.query;
        try {
            const proxy = new Proxy(query, Handlers.queryHandler());

            const members = await TeamMemberService.getByParams({
                account: new ObjectID(req.user.account),
                team: new ObjectID(teamId)
            }, proxy);

            return res.status(SUCCESS_CODE).json(members);
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const { id } = req.params;
        try {
            const member = await TeamMemberService.getById(id);

            await TeamMemberService.delete(member._id);

            return res.status(NO_CONTENT_CODE).json({});
        } catch (err) {
            next(err);
        }
    }
}
