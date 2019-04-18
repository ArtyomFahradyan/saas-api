import Handlers from '../../../helpers/handlers';
import { SUCCESS_CODE } from '../../../configs/status-codes';
import { AccountService } from '../../../services';
import { NotFound } from '../../../errors';
import { NOT_EXISTS } from '../../../configs/constants';

export class AccountsController {
    static async getAccounts(req, res, next) {
        const query = req.query;
        try {
            const handler = Handlers.queryHandler();
            const proxy = new Proxy(query, handler);

            const companies = await AccountService.getAll(proxy);

            return res.status(SUCCESS_CODE).json(companies);
        } catch (err) {
            next(err);
        }
    }

    static async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const account = await AccountService.getById(id);

            if (!account) {
                throw new NotFound(NOT_EXISTS('Account'));
            }

            return res.status(SUCCESS_CODE).json(account);
        } catch (err) {
            next(err);
        }
    }
}
