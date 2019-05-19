import { AccountService, UserService } from '../../services';
import { INVALID, NOT_EXISTS, REMINDER_RANGE } from '../../configs/constants';
import { BadRequest, NotFound } from '../../errors';
import { SUCCESS_CODE } from '../../configs/status-codes';

export class AccountsController {
    static async setReminder(req, res, next) {
        let { reminder } = req.body;
        try {
            if (!REMINDER_RANGE.includes(reminder)) {
                throw new BadRequest(INVALID('Reminder range'));
            }

            await AccountService.update(req.user.account, { reminder });

            return res.status(SUCCESS_CODE).json({ success: true });
        } catch (e) {
            next(e);
        }
    }

    static async getDashboardData(req, res, next) {
        const user = req.user;
        const { offset } = req.query;
        try {

            const dashboardData = await AccountService.getDashboardData(user.account, offset);

            return res.status(SUCCESS_CODE).json(dashboardData);
        } catch (e) {
            next(e);
        }
    }

    static async setFiscalYear(req, res, next) {
        const { id } = req.user;
        const { fiscalYearStartAt } = req.body;
        try{
            const user = await UserService.getById(id);

            if(!user) {
                throw new NotFound(NOT_EXISTS('User'));
            }

            const accountId = user.account;

            const account = await AccountService.getById(accountId);

            if(!account) {
                throw new NotFound(NOT_EXISTS('Account'));
            }

            await AccountService.update(accountId, { fiscalYearStartAt });

            return res.status(SUCCESS_CODE).json({ success: true });
        } catch (err) {
            next(err);
        }
    }
}
