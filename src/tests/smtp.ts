import SmtpFace from "../sdk/smtp"
import { PASS_KEY, SMTP_PORT_KEY, SMTP_SERVER_KEY, TOKEN_KEY, USER_KEY, VENDOR_KEY, V_126, V_GMAIL } from "../strategy";

// describe('smtp 126', () => {
//     it('connect smtp', async () => {
//         let smtp = new SmtpFace({
//             [USER_KEY]: 'bugu1986@126.com',
//             [PASS_KEY]: 'UMXTDSXKNLBRSSOB',
//             [SMTP_SERVER_KEY]: 'smtp.126.com',
//             [SMTP_PORT_KEY]: 994,
//             [VENDOR_KEY]: V_126,
//         });
//         await smtp.init();
//         await smtp.send('bugu1986@gmail.com', 'Test Email Subject', 'Example Plain Text Message Body');
//     })
// })

// function delay(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// delay(5 * 1000);

describe('smtp gmail', () => {
    it('connect smtp', async () => {
        let smtp = new SmtpFace({
            [USER_KEY]: 'bugu1986@gmail.com',
            [TOKEN_KEY]: '1//0ghvzYaAS5q3BCgYIARAAGBASNwF-L9IrPvBvg7Mbi1shBJMbezvkwLr06cXtmh-GfYMm_j6yBkJkbbAq0kILp5qefQFs6tzeDyo',
            [SMTP_SERVER_KEY]: 'smtp.gmail.com',
            [SMTP_PORT_KEY]: 465,
            [VENDOR_KEY]: V_GMAIL,
        });
        await smtp.init();
        await smtp.send('bugu1986@126.com', 'Test Email Subject123', '<h1>Example Plain Text Message Body</h1>');
        smtp.close();
    })
})