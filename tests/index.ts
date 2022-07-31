import * as chai from 'chai';
import Imap from '../src/sdk/imap';

import * as RawImap from 'node-imap';
const inspect = require('util').inspect;
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('imap', () => {
    it('getBoxes',async () => {
        let imap = Imap.connect();
        await delay(5 * 1000);
        let b = await imap.getBoxesAsync();
        console.log(b);
        imap.end();
    })

    it('read selected mailbox',async () => {
        let imap = Imap.connect();
        await delay(5 * 1000);
        let mails = await Imap.openMail('INBOX');
        console.log(mails);
        await delay(5 * 1000);
        imap.end();
    })
})