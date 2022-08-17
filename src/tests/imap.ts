import ImapFace from '../sdk/imap';
import { assert } from 'chai';
import { DISPLAY_KEY, IMAP_PORT_KEY, IMAP_SERVER_KEY, PASS_KEY, TOKEN_KEY, USER_KEY, VENDOR_KEY, V_126, V_GMAIL, V_QQ } from '../strategy';
// describe('imap-126', () => {
//     let imapFace: ImapFace;
//     let imap: any;
//     before(async function () {
//         imapFace = new ImapFace();
//         await imapFace.init({
//             [IMAP_SERVER_KEY]: 'imap.126.com',
//             [IMAP_PORT_KEY]: 993,
//             [USER_KEY]: 'xxx@126.com',
//             [PASS_KEY]: 'xxx',
//             [DISPLAY_KEY]: 'my126',
//             [VENDOR_KEY]: V_126,
//         });
//         imap = await imapFace.connect();
//     });
//     after(function () {
//         imap.end();
//     });

//     it('getBoxes',async () => {
//         let b = await imap.getBoxesAsync();
//         // console.log(b);
//         assert(Object.keys(b.length > 0));
//     })

//     it('read selected mailbox', async () => {
//         let mails = await imapFace.openMail('INBOX');
//         // console.log(mails);
//         assert(mails.length > 0);
//     })
// })

// function delay(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// delay(5 * 1000);


// describe('imap-gmail', () => {
//     let imapFace: ImapFace;
//     let imap: any;
//     before(async function () {
//         imapFace = new ImapFace();
//         await imapFace.init({
//             [IMAP_SERVER_KEY]: 'imap.gmail.com',
//             [IMAP_PORT_KEY]: 993,
//             [USER_KEY]: 'bugu1986@gmail.com',
//             [TOKEN_KEY]: '1//0ghvzYaAS5q3BCgYIARAAGBASNwF-L9IrPvBvg7Mbi1shBJMbezvkwLr06cXtmh-GfYMm_j6yBkJkbbAq0kILp5qefQFs6tzeDyo',
//             [DISPLAY_KEY]: 'mygmail',
//             [VENDOR_KEY]: V_GMAIL,
//         });
//         imap = await imapFace.connect();
//     });
//     after(function () {
//         imap.end();
//     });
//     // it('saveMeta', async () => {
//     //     await saveMeta('gmail', 'bugu1986@gmail.com', {} as any);
//     // })
//     it('getBoxes', async () => {
//         let b = await imap.getBoxesAsync();
//         console.log(b);
//         assert(Object.keys(b.length > 0));
//     })

//     it('read selected mailbox', async () => {
//         let mails = await imapFace.openMail('INBOX');
//         console.log(mails);
//         assert(mails.length > 0);
//     })
// })
describe('imap-126', () => {
    let imapFace: ImapFace;
    let imap: any;
    before(async function () {
        imapFace = new ImapFace();
        await imapFace.init({
            [IMAP_SERVER_KEY]: 'imap.exmail.qq.com',
            [IMAP_PORT_KEY]: 993,
            [USER_KEY]: 'bohe@testexchange.wecom.work',
            [PASS_KEY]: '2E8BeDJH5EWP7d',
            [DISPLAY_KEY]: 'myqq',
            [VENDOR_KEY]: V_QQ,
        });
        imap = await imapFace.connect();
    });
    after(function () {
        imap.end();
    });

    it('getBoxes',async () => {
        let b = await imap.getBoxesAsync();
        console.log(b);
        assert(Object.keys(b.length > 0));
    })

    it('read selected mailbox', async () => {
        let mails = await imapFace.openMail('INBOX', false);
        console.log(mails);
        assert(mails.length > 0);
    })
})