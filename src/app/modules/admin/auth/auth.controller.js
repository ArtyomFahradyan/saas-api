import {
    AdminService
} from '../../../services';
import { SUCCESS_CODE } from '../../../configs/status-codes';
import { INVALID_EMAIL_OR_PASSWORD } from '../../../configs/constants';
import { BadRequest } from '../../../errors';
import Utils from '../../../helpers/utils';

export class AuthController {

    static async login(req, res, next) {
        const { email, password } = req.body;

        let admin;
        try {
            admin = await AdminService.getByEmail(email);

            if (!admin || !admin.comparePassword(password)) {
                return next(new BadRequest(INVALID_EMAIL_OR_PASSWORD));
            }

            const tokenInfo = Utils.signJWTToken(admin, true);

            return res.status(SUCCESS_CODE).json({
                access_token: tokenInfo.token,
                admin: {
                    id: admin.id,
                    email: admin.email
                }
            });
        }
        catch (err) {
            return next(err);
        }
    }

    static async logout(req, res, next) {
        try {
            req.logout();

            return res.status(SUCCESS_CODE)
                    .json({
                        success: true
                    });
        } catch (err) {
            next(err);
        }
    }

    static async getAdmin({ user }, res, next) {
        try {
            const admin = await AdminService.getByEmail(user.email);

            return res.status(SUCCESS_CODE)
                    .json({
                        admin: {
                            id: admin.id,
                            email: admin.email
                        }
                    });
        } catch (err) {
            next(err);
        }
    }

}
