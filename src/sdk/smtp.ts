import * as nodemailer from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import { PASS_KEY, SMTP_PORT_KEY, SMTP_SERVER_KEY, USER_KEY } from '../strategy';
export default class SmtpFace {
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    constructor(private config: any) {
        this.transporter = nodemailer.createTransport({
            host: config[SMTP_SERVER_KEY],
            port: config[SMTP_PORT_KEY],
            auth: {
                user: config[USER_KEY],
                pass: config[PASS_KEY],
            },
            secure: true,
            tls: {
                // must provide server name, otherwise TLS certificate check will fail
                servername: config[SMTP_SERVER_KEY],
            },
            debug: true
        });
    }

    /**
     * send
     */
    public async send(to: string, subject: string, html: string) {
        // send email
        await this.transporter.sendMail({
            from: this.config[USER_KEY],
            to: to,
            subject: subject,
            html: html
        });
    }
}