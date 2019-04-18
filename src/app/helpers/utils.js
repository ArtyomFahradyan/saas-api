import moment from 'moment';
import * as jwt from 'jsonwebtoken';
import params from '../configs/params';
const crypto = require('crypto');

export default class Utils {
    static signJWTToken(data, admin = false) {
        const payload = { id: data._id, created_at: moment().toString() };
        let secret = admin ? params.adminTokenSecret : params.userTokenSecret;

        let token = jwt.sign(payload, secret);

        return { token };
    }

    static verifyJWTToken(token, secret = params.userTokenSecret) {
        try {
            return jwt.verify(token, secret);
        } catch (e) {
            return null;
        }
    }

    static createToken(expirationHours = 1, size = 16) {
        return {
            token: crypto.randomBytes(size).toString('hex'),
            exp: moment().add(expirationHours, 'hours')
                    .valueOf()
        };

    }

    static checkUsage(usage, avg) {
        switch (usage) {
                case 'Small':
                    return { avgSmallPrice: avg };
                case 'Medium':
                    return { avgMediumPrice: avg };
                case 'Large':
                    return { avgLargePrice: avg };
                default:
                    return {};
        }
    }

    static isMasterAdmin(admin) {
        return admin.role === 'MA';
    }

}
