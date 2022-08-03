import * as chai from 'chai';
import ImapFace from '../src/sdk/imap';
import { assert } from 'chai';
import { IMAP_PORT_KEY, IMAP_SERVER_KEY, PASS_KEY, USER_KEY } from '../src/strategy';
const inspect = require('util').inspect;
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('imap', () => {
    let imapFace: ImapFace;
    let imap: any;
    before(async function () {
        imapFace = new ImapFace({
            [IMAP_SERVER_KEY]: 'imap.126.com',
            [IMAP_PORT_KEY]: 993,
            [USER_KEY]: 'bugu1986@126.com',
            [PASS_KEY]: 'UMXTDSXKNLBRSSOB',
        });
        imap = await imapFace.connect();
        // await delay(10 * 1000);
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
        let mails = await imapFace.openMail('INBOX');
        console.log(mails);
        assert(mails.length > 0);
    })
})
