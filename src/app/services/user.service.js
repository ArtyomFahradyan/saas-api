import mongoose from 'mongoose';
const User = mongoose.model('User');
import { MailService } from './mail.service';
import params from '../configs/params';
import {
    VERIFICATION_EMAIL_SUBJECT,
    VERIFICATION_MESSAGE,
    RESET_PASSWORD_MESSAGE,
    RESET_PASSWORD_SUBJECT,
    INVITATION_MESSAGE,
    INVITATION_SUBJECT
} from '../configs/constants';

export class UserService {

    constructor() { }

    static async getById(_id) {
        return await User.findOne({ _id })
                .select('email firstName lastName createdAt emailVerified');
    }

    static async getByEmail(email) {
        return await User.findOne({ email });
    }

    static async getAccountUsers(user) {
        return await User.find({ createdBy: user._id, emailVerified: true, isAccountOwner: false })
                .select('email firstName lastName createdAt emailVerified');
    }

    static async getAll(options) {
        let query = [];

        query.push(
            { $sort: { createdAt: -1 } },
            { $project: { password: 0 } },
            { $group: {
                _id: null,
                users: { $push: '$$ROOT' },
                count: { $sum: 1 }
            } },
        );

        let size = options.size || 10;
        let offset = options.offset || 0;

        query.push({
            $project: {
                users: { $slice: [ '$users', offset, size ] },
                count: 1
            }
        });

        let result = await User.aggregate(query);

        if (result.length) {
            return {
                users: result[0].users,
                count: result[0].count
            };
        } else {
            return {
                users: [],
                count: 0
            };
        }
    }

    static async create(payload) {
        let user = new User({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            password: payload.password,
            isAccountOwner: true
        });

        user.password = user.generatePassword(user.password);

        return await User.create(user);
    }

    static async createSubUser(payload, user) {
        const data = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            account: user.account,
            createdBy: user._id
        };

        return await User.create(data);
    }

    static async sendInvitationMail(user, token) {
        return await MailService.sendMail(
            params.emailFrom,
            user.email,
            INVITATION_MESSAGE(`${params.appUrl}/invite/confirm?invitationToken=${token}`),
            INVITATION_SUBJECT,
            {
                html: true
            }
        );
    }

    static async sendVerificationMail(user, token) {

        return await MailService.sendMail(
            params.emailFrom,
            user.email,
            VERIFICATION_MESSAGE(`${params.appUrl}/verify-email/confirm?verifyToken=${token}`),
            VERIFICATION_EMAIL_SUBJECT,
            {
                html: true
            }
        );
    }

    static async sendPasswordResetMail(email, token) {
        await MailService.sendMail(
            params.emailFrom,
            email,
            RESET_PASSWORD_MESSAGE(`${params.appUrl}/reset-password/confirm/?resetToken=${token}`),
            RESET_PASSWORD_SUBJECT,
            {
                html: true
            }
        );
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return User.findOneAndUpdate({ _id }, attributes, options);
    }

    static async delete(_id) {
        return await User.findOneAndDelete({ _id });
    }

}
