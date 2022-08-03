import SmtpFace from "../src/sdk/smtp"
import { PASS_KEY, SMTP_PORT_KEY, SMTP_SERVER_KEY, USER_KEY } from "../src/strategy";

describe('smtp', () => {
    it('connect smtp', async () => {
        let smtp = new SmtpFace({
            [USER_KEY]: 'bugu1986@126.com',
            [PASS_KEY]: 'UMXTDSXKNLBRSSOB',
            [SMTP_SERVER_KEY]: 'smtp.126.com',
            [SMTP_PORT_KEY]: 994,
        });
        await smtp.send('bugu1986@gmail.com', 'Test Email Subject', 'Example Plain Text Message Body');
    })
})