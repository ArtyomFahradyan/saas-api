import params from '../configs/params';
import { ExternalApiError } from '../errors';
const sgMail = require('@sendgrid/mail');

export class MailService {

    constructor () {}

    static async sendMail(from, to, message, subject, options) {
        let defaultOptions = { html: false, ...options };

        from = from || params.emailFrom;

        try {
            const msg = {
                to,
                from: {
                    email: from,
                },
                subject,
                // templateId: options.template && options.template,
                // dynamic_template_data: options.dynamic_template_data && options.dynamic_template_data
            };

            /* if (params.additionalEmails) {
                let additionalEmails = params.additionalEmails.filter(email => email !== to);

                if (additionalEmails.length) {
                    msg.bcc = additionalEmails;
                }
            } */

            if (defaultOptions.html) {
                msg.html = message;
            } else {
                msg.text = message;
            }

            return await sgMail.send(msg);
        } catch(e) {
            console.log(e);
            throw new ExternalApiError(e);
        }
    }
}
