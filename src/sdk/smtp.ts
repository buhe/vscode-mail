import * as nodemailer from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
export default class SmtpFace {
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.126.com',
            port: 994,
            auth: {
                user: 'bugu1986@126.com',
                pass: 'UMXTDSXKNLBRSSOB'
            },
            secure: true,
            tls: {
                // must provide server name, otherwise TLS certificate check will fail
                servername: 'smtp.126.com'
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
            from: 'bugu1986@126.com',
            to: to,
            subject: subject,
            html: html
        });
    }
}