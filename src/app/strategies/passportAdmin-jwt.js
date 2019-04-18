import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');
import { NOT_EXISTS } from '../configs/constants';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthError } from '../errors';

export default (secret, passport) => {
    passport.serializeUser((admin, done) => {
        done(null, admin.id);
    });
    passport.deserializeUser(async (id, done) => {
        let admin = await Admin.query().findById(id)
            .first();
        admin ? done(null, admin) : done(new AuthError(NOT_EXISTS), null);
    });

    let jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    };

    let strategy = new Strategy(jwtOptions, async (payload, next) => {
        let admin = await Admin.findById(payload.id);

        if (admin) {
            next(null, admin);
        } else {
            next(new AuthError(NOT_EXISTS), false);
        }
    });
    passport.use('admin-rule', strategy);
};
