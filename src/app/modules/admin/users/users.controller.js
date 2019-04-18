import { UserService } from '../../../services';
import { SUCCESS_CODE } from '../../../configs/status-codes';
import Handlers from '../../../helpers/handlers';

export class UsersController {
    static async getAll(req, res, next) {
        const query = req.query;
        try {
            const proxy = new Proxy(query, Handlers.queryHandler());
            const users = await UserService.getAll(proxy);

            return res.status(SUCCESS_CODE).json(users);
        } catch (e) {
            next(e);
        }
    }
}
