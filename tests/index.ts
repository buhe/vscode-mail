import * as chai from 'chai';
import Imap from '../src/sdk/imap';
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('imap', () => {
    it('connect', async (done) => {
        console.log('before');
        let imap = new Imap();
        imap.connect();
        // await delay(20 * 1000);
        done();
        console.log('end');
    })
})