import * as chai from 'chai';
import Imap from '../src/sdk/imap';
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('imap', () => {
    // it('connect', async (done) => {
    //     console.log('before');
    //     let imap = new Imap();
    //     imap.connect();
    //     // await delay(20 * 1000);
    //     done();
    //     console.log('end');
    // })

    it('getBoxes',async () => {
        let imap = Imap.connect();
        await delay(10 * 1000);
        let b = await imap.getBoxesAsync();
        console.log(b);
    })
})