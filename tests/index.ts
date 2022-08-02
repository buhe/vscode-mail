import * as chai from 'chai';
import Imap from '../src/sdk/imap';

import * as RawImap from 'node-imap';
import { assert } from 'chai';
const inspect = require('util').inspect;
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('imap', () => {
    let imap: any;
    before(async function () {
        imap = await Imap.connect();
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
        let mails = await Imap.openMail('INBOX');
        console.log(mails);
        assert(mails.length > 0);
    })
})
