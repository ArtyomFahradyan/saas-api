import mongoose from 'mongoose';
const User = mongoose.model('User');
import { NOT_EXISTS } from '../configs/constants';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthError } from '../errors';

export default (secret, passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await User.query().findById(id)
                .first();
        user ? done(null, user) : done(new AuthError(NOT_EXISTS), null);
    });

    let jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    };

    let strategy = new Strategy (jwtOptions, async (payload, next) => {
        let user = await User.findById(payload.id);

        if (user) {
            next(null, user);
        } else {
            next(new AuthError(NOT_EXISTS), false);
        }
    });
    passport.use('user-rule', strategy);
};
