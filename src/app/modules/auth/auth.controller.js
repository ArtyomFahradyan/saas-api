import { AccountService, TeamService, TokenService, UserService } from '../../services/index';
import { SUCCESS_CODE } from '../../configs/status-codes';
import { AuthError, BadRequest, NotFound } from '../../errors/index';
import {
    ALREADY_EXISTS, INVALID,
    INVALID_EMAIL_OR_PASSWORD,
    TOKEN_EXPIRED,
    VERIFICATION_ERROR
} from '../../configs/constants';
import Utils from '../../helpers/utils';
import moment from 'moment';

export class AuthController {

    static async signup(req, res, next) {
        const payload = req.body;
        try {
            if (payload.password !== payload.confirmPassword) {
                throw new BadRequest(INVALID('Password'));
            }

            let user = await UserService.getByEmail(payload.email);

            if (user) {
                throw new BadRequest(ALREADY_EXISTS('Email'));
            }

            let account = await AccountService.getByCompany(payload.company);

            if (account) {
                throw new BadRequest(ALREADY_EXISTS('Account'));
            }

            user = await UserService.create(payload);

            const team = await TeamService.getById(payload.team);

            account = await AccountService.create({
                owner: user._id,
                company: payload.company,
                team: team._id
            });

            await UserService.update(user._id, {
                account: account._id
            });

            let info = Utils.createToken();

            await TokenService.create({
                token: info.token,
                expirationDate: info.exp,
                user: user._id
            });

            await UserService.sendVerificationMail(user, info.token);

            return res.status(SUCCESS_CODE).json({
                account,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    account: account._id,
                    emailVerified: user.emailVerified,
                    isAccountOwner: user.isAccountOwner,
                    createdAt: user.createdAt
                },
            });
        } catch(err) {
            next(err);
        }
    }

    static async verify({ body }, res, next) {
        try {
            const oldToken = await TokenService.deleteByToken(body.token);

            if (!oldToken ) {
                return next(new BadRequest(INVALID('Token')));
            } else if (oldToken.expirationDate < moment().valueOf()) {
                const user = await UserService.getById(oldToken.user);
                if(!user) {
                    throw new NotFound('User');
                }
                const newToken = await Utils.createToken();

                await TokenService.create({
                    token: newToken.token,
                    expirationDate: newToken.exp,
                    user: oldToken.user
                });

                await UserService.sendVerificationMail(user, newToken.token);

                return next(new BadRequest('Token is outdated. Please check your Email'));
            } else {
                await UserService.update(oldToken.user, {
                    emailVerified: true
                });
            }

            return res.status(SUCCESS_CODE).json({
                success: true
            });
        } catch (e) {
            next(e);
        }
    }

    static async login(req, res, next) {
        const { email, password } = req.body;

        try {
            let user = await UserService.getByEmail(email);

            if (!user || !user.comparePassword(password)) {
                throw new BadRequest(INVALID_EMAIL_OR_PASSWORD);
            } else if (user && !user.emailVerified) {
                throw new AuthError(VERIFICATION_ERROR);
            }

            await AccountService.setLastLogin(user.account);

            const tokenInfo = Utils.signJWTToken(user);

            return res.status(SUCCESS_CODE)
                    .json({
                        access_token: tokenInfo.token,
                        user: {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.lastName,
                            createdAt: user.createdAt,
                            emailVerified: user.emailVerified,
                            isAccountOwner: user.isAccountOwner
                        }
                    });
        } catch (err) {
            next(err);
        }
    }

    static async logout(req, res, next) {
        try {
            req.logout();

            return res.status(SUCCESS_CODE).json({
                success: true
            });
        } catch (err) {
            next(err);
        }
    }

    static async resetPasswordCheckEmail(req, res, next) {
        const { email } = req.body;
        try {
            let user = await UserService.getByEmail(email);

            if (user) {
                const tokenInfo = Utils.createToken();
                const existingToken = await TokenService.getByUserId(user._id);

                if (existingToken) {
                    await TokenService.update(existingToken._id, {
                        token: tokenInfo.token,
                        expirationDate: tokenInfo.exp
                    });
                } else {
                    await TokenService.create({
                        token: tokenInfo.token,
                        expirationDate: tokenInfo.exp,
                        user: user._id
                    });
                }

                await UserService.sendPasswordResetMail(user.email, tokenInfo.token);
            }

            return res.status(SUCCESS_CODE)
                    .json({
                        success: true
                    });
        } catch (e) {
            next(e);
        }
    }

    static async resetPassword(req, res, next) {
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
                password: hash
            });

            return res.status(SUCCESS_CODE).json({
                success: true
            });
        } catch (e) {
            next(e);
        }
    }

}
