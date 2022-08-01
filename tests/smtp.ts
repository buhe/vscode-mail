import SmtpFace from "../src/sdk/smtp"

describe('smtp', () => {
    it('connect smtp', async () => {
        let smtp = new SmtpFace();
        await smtp.connect();
    })
})