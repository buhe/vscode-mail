import * as nodemailer from 'nodemailer';
export default class SmtpFace {
    /**
     * connect
     */
    public async connect() {
        // create transporter object with smtp server details
        const transporter = nodemailer.createTransport({
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

        // send email
        await transporter.sendMail({
            from: 'bugu1986@126.com',
            to: 'bugu1986@gmail.com',
            subject: 'Test Email Subject',
            text: 'Example Plain Text Message Body'
        });
    }
}