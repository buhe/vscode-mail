import SmtpFace from "../src/sdk/smtp"

describe('smtp', () => {
    it('connect smtp', async () => {
        let smtp = new SmtpFace();
        await smtp.connect();
        await smtp.send('bugu1986@gmail.com', 'Test Email Subject', 'Example Plain Text Message Body');
    })
})