import Utils from '../../helpers/utils';
import { AccountService, TokenService, UserService } from '../../services';
import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../configs/status-codes';
import { BadRequest, Conflict, Forbidden, NotFound } from '../../errors';
import { ALREADY_EXISTS, INVALID, NOT_EXISTS, TOKEN_EXPIRED } from '../../configs/constants';
import moment from 'moment';

export class UserController {
    static async getUser(req, res, next) {
        try {
            const { authorization } = req.headers;
            const token = authorization.replace('Bearer ', '');

            const tokenInfo = await Utils.verifyJWTToken(token);
            const user = await UserService.getById(tokenInfo.id);

            const account = await AccountService.getFilesByAccount(user.account);

            if (!user) {
                throw new NotFound(NOT_EXISTS('User'));
            }

            return res.status(SUCCESS_CODE)
                    .json({
                        user: {
                            _id: user._id,
                            email: user.email,
                            account,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            isAccountOwner: user.isAccountOwner,
                        }
                    });
        } catch (err) {
            next(err);
        }
    }

    static async changePassword(req, res, next) {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;
        try {
            if (!user.comparePassword(oldPassword)) {
                throw new BadRequest(INVALID('Password'));
            }

            const hash = user.generatePassword(newPassword);

            await UserService.update(user._id, { password: hash });

            return res.status(SUCCESS_CODE).json({
                success: true
            });
        } catch (err) {
            next(err);
        }
    }

    static async addUserCheckEmail(req, res, next) {
        const payload = req.body;
        try {
            if (!req.user.isAccountOwner) {
                throw new Forbidden();
            }

            let existingUser = await UserService.getByEmail(payload.email);

            if (existingUser) {
                throw new BadRequest(ALREADY_EXISTS('User'));
            }

            let user = await UserService.createSubUser(payload, req.user);

            let info = Utils.createToken();

            await TokenService.create({
                token: info.token,
                expirationDate: info.exp,
                user: user._id
            });

            await UserService.sendInvitationMail(user, info.token);

            return res.status(SUCCESS_CODE).json(user);
        } catch (err) {
            next(err);
        }
    }

    static async resendMail(req, res, next) {
        const { id } = req.params;
        try {
            let user = await UserService.getById(id);

            if (!user) {
                throw new NotFound(NOT_EXISTS('User'));
            }
            let info = await TokenService.getByUserId(user._id);

            if (!info || info.expirationDate < moment().valueOf()) {
                info = Utils.createToken();

                await TokenService.create({
                    token: info.token,
                    expirationDate: info.exp,
                    user: user._id
                });
            }

            await UserService.sendInvitationMail(user, info.token);

            return res.status(SUCCESS_CODE).json({ success: true });
        } catch (e) {
            next(e);
        }
    }

    static async addUser(req, res, next) {
        const { token } = req.params;
        const { password } = req.body;
        try {
            const info = await TokenService.deleteByToken(token);

            if (!info || info.expirationDate < moment().valueOf()) {
                throw new BadRequest(TOKEN_EXPIRED);
            }

            const user = await UserService.getById(info.user);

            const hash = user.generatePassword(password);

            await UserService.update(user._id, {
                password: hash,
                emailVerified: true
            });

            return res.status(SUCCESS_CODE).json({
                success: true
            });
        } catch (err) {
            next(err);
        }
    }

    static async getUsers(req, res, next) {
        const options = req.query;
        try {
            if (!req.user.isAccountOwner) {
                throw new Forbidden();
            }

            const users = await UserService.getAccountUsers(req.user._id, options);

            return res.status(SUCCESS_CODE).json(users);
        } catch (err) {
            next(err);
        }
    }

    static async editUser(req, res, next) {
        const { subUserId } = req.params;
        const { firstName, lastName, email } = req.body;
        try {
            if (!req.user.isAccountOwner) {
                throw new Forbidden();
            }

            const subUser = await  UserService.getById(subUserId);
            const existingUser = await UserService.getByEmail(email);

            if(!subUser) {
                throw new BadRequest(NOT_EXISTS('User'));
            }

            if (existingUser && existingUser._id.toString() !== subUser._id.toString()) {
                throw new BadRequest(ALREADY_EXISTS('User'));
            }

            const updated = await UserService.update(subUserId, { firstName, lastName, email });

            return res.status(SUCCESS_CODE).json(updated);
        } catch (err) {
            next(err);
        }
    }

    static async deleteUser(req, res, next) {
        const { id } = req.params;
        try {
            if (!req.user.isAccountOwner) {
                throw new Forbidden();
            }

            const user = await UserService.getById(id);

            if (!user) {
                throw new NotFound(NOT_EXISTS('User'));
            } else if (user && user.email === req.user.email) {
                throw new Conflict();
            }

            await UserService.delete(user._id);

            return res.status(NO_CONTENT_CODE).json({});
        } catch (err) {
            next(err);
        }
    }

}
