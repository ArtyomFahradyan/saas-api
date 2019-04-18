import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');
import { MailService } from './mail.service';
import { MA, NOTIFICATION_MESSAGE, NOTIFICATION_SUBJECT } from '../configs/constants';
import params from '../configs/params';

export class AdminService {

    constructor() { }

    static async getByEmail(email) {
        return Admin.findOne({ email });
    }

    static async getMasterAdmin() {
        return await Admin.findOne({ role: MA });
    }

    static async sendNotificationMail() {
        const admin = await this.getMasterAdmin();

        return await MailService.sendMail(
            params.emailFrom,
            admin.email,
            NOTIFICATION_MESSAGE,
            NOTIFICATION_SUBJECT,
            {
                html: true
            }
        );
    }

}
