import * as chai from 'chai';
import Imap from '../src/sdk/imap';


describe('imap', () => {
    it('connect', async (done) => {
        console.log('before');
        let imap = new Imap();
        imap.connect();
        done();
        console.log('end');
    })
})