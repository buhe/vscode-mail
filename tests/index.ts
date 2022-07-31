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
        let imap = new Imap();
        let map = imap.connect(async (i) => {
        //    let b = await i.getBoxesAsync();
        //    console.log(b);
        });
        await delay(20 * 1000);
        let b = await map.getBoxesAsync();
        console.log(b);
        // try{
        //     let boxes = await imap.getBoxes('/');
        //     console.log(boxes);
        // }catch(e: any){
        //     console.log('catch getBoxes' + e);
        // }
        
    })
})