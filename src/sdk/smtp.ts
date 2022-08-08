import * as nodemailer from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import { PASS_KEY, SMTP_PORT_KEY, SMTP_SERVER_KEY, TOKEN_KEY, USER_KEY, VENDOR_KEY, V_126, V_GMAIL } from '../strategy';
import { getToken } from './gmail/token';
const client_id = '106957458440-ectevvqgch5o9pq0jm8lrbfeab9nu23d.apps.googleusercontent.com';
const client_secret = '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';
export default class SmtpFace {
    private transporter?: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    constructor(private config: any) {
        
    }

    /**
     * async init
     */
    public async init() {
        switch (this.config[VENDOR_KEY]) {
            case V_126:
                this.transporter = nodemailer.createTransport({
                    host: this.config[SMTP_SERVER_KEY],
                    port: this.config[SMTP_PORT_KEY],
                    auth: {
                        user: this.config[USER_KEY],
                        pass: this.config[PASS_KEY],
                    },
                    secure: true,
                    tls: {
                        // must provide server name, otherwise TLS certificate check will fail
                        servername: this.config[SMTP_SERVER_KEY],
                    },
                    debug: true
                });
                break;
        
            case V_GMAIL:
                let token = await getToken(this.config[USER_KEY], this.config[TOKEN_KEY]);
                this.transporter = nodemailer.createTransport({
                    host: this.config[SMTP_SERVER_KEY],
                    port: this.config[SMTP_PORT_KEY],
                    auth: {
                        user: this.config[USER_KEY],
                        type: "OAuth2",
                        accessToken: token,
                        clientId: client_id,
                        clientSecret: client_secret,
                        refreshToken: this.config[TOKEN_KEY],
                    },
                    secure: true,
                    tls: {
                        // must provide server name, otherwise TLS certificate check will fail
                        servername: this.config[SMTP_SERVER_KEY],
                    },
                    debug: true
                });
                break;
        }
    }

    /**
     * send
     */
    public async send(to: string, subject: string, html: string) {
        // send email
        await this.transporter!.sendMail({
            from: this.config[USER_KEY],
            to: to,
            subject: subject,
            html: html
        });
    }
}