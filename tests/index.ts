import * as chai from 'chai';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('imap', () => {
    it('connect', async () => {
        console.log('hello');
        await delay(400);
        console.log('end');
    })
})