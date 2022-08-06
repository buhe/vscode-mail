import * as chai from 'chai';
import ImapFace from '../sdk/imap';
import { assert } from 'chai';
import { DISPLAY_KEY, IMAP_PORT_KEY, IMAP_SERVER_KEY, PASS_KEY, USER_KEY } from '../strategy';
import { getCode, getToken } from '../sdk/gmail/token';
let { web: { client_id, client_secret, refresh_token } } = require('./client_secret') // the client_secret.json file
var xoauth2 = require("xoauth2"),
    xoauth2gen;
var Imap = require('node-imap'),
inspect = require('util').inspect;
// describe('imap-126', () => {
//     let imapFace: ImapFace;
//     let imap: any;
//     before(async function () {
//         imapFace = new ImapFace({
//             [IMAP_SERVER_KEY]: 'imap.126.com',
//             [IMAP_PORT_KEY]: 993,
//             [USER_KEY]: 'bugu1986@126.com',
//             [PASS_KEY]: 'UMXTDSXKNLBRSSOB',
//             [DISPLAY_KEY]: 'my126',
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


describe('imap-gmail', () => {
    let imapFace: ImapFace;
    let imap: any;
    before(async function () {
        // imapFace = new ImapFace({
        //     [IMAP_SERVER_KEY]: 'gmail.126.com',
        //     [IMAP_PORT_KEY]: 993,
        //     [USER_KEY]: 'bugu1986@gmail.com',
        //     [PASS_KEY]: '&pAdkpYt7GNLJ1@Z',
        //     [DISPLAY_KEY]: 'mygmail',
        // });
        // imap = await imapFace.connect();
    });
    after(function () {
        // imap.end();
    });
    it('getCode', async () => {
        getCode();
    })
    it('getToken', async () => {
        // 1. https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcode&prompt=consent&response_type=code&client_id=106957458440-ectevvqgch5o9pq0jm8lrbfeab9nu23d.apps.googleusercontent.com&scope=https%3A%2F%2Fmail.google.com%2F+https%3A%2F%2Fmail.google.com%2F&access_type=offline
        // 2. http://localhost:3000/code?code=4/0AdQt8qi-2r6IEG5ribqzQ5xn48EtektGPRlrL9PJ-C7IMdLU35nqUZMt83pWM2aRvMJkIg&scope=https://mail.google.com/ getCode
        // 3. post https://oauth2.googleapis.com/token application/x-www-form-urlencoded code=4%2F0AdQt8qiEojYqXoT9nQZWIqdyjASkqAlZucXnyMambVUxtZu2sHTxDBPXLcKb7qUaRAEJlg&redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&client_id=106957458440-pr6c8mgg6hj15f5g21n2kfbaru66n9hj.apps.googleusercontent.com&client_secret=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&scope=&grant_type=authorization_code
        /*
        {
  "access_token": "ya29.A0AVA9y1uqwp7mpbCkiNayDcOhOPXr_n7wN2pYBRS9ypkarkizuLJIB-wZoQBhFK8obIfFO3mNsT7fnxvh1s_wVJrvgTPIJ0ELYV095scdk74G1fdb0VprHAWuO_djvaC_2nf3sJ8DoidS84QqLpcvDtLRHiX7aCgYKATASATASFQE65dr89OXu2mfcqn-Ob_NpyIpJDA0163", 
  "scope": "https://mail.google.com/", 
  "token_type": "Bearer", 
  "expires_in": 3599, 
  "refresh_token": "1//04rH8M1yvCjp4CgYIARAAGAQSNwF-L9IrYbwlJTyGyS-nFMGinHDJm3sXrKx8WlfRTz4x9uCFAn9R_GELxKZFyu9ZQC5CZETaM3o"
}
        */

        // let token = await getToken('bugu1986@gmail.com', '1//04rH8M1yvCjp4CgYIARAAGAQSNwF-L9IrYbwlJTyGyS-nFMGinHDJm3sXrKx8WlfRTz4x9uCFAn9R_GELxKZFyu9ZQC5CZETaM3o');
        // console.log(token);
    })
    it('getBoxes', async () => {
        // let b = await imap.getBoxesAsync();
        // // console.log(b);
        // assert(Object.keys(b.length > 0));
        
        // let xoauth2gen = xoauth2.createXOAuth2Generator({
        //     user: 'bugu1986@gmail.com', // the email address
        //     clientId: client_id,
        //     clientSecret: client_secret,
        //     refreshToken: refresh_token
        // })

        // xoauth2gen.getToken(function (err: any, xoauth2token: any) {
        //     if (err) {
        //         return console.log(err)
        //     }

        //     let imap = new Imap({
        //         xoauth2: xoauth2token,
        //         host: 'imap.gmail.com',
        //         port: 993,
        //         tls: true,
        //         authTimeout: 10000,
        //         debug: console.log,
        //     });

        //     imap.once('ready', function () {
        //         imap.openBox('INBOX', true, function(err: any,box:any){
        //             if (err) throw err;
        //             var f = imap.seq.fetch('1:3', {
        //                 bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        //                 struct: true
        //             });
        //             f.on('message', function (msg: any, seqno: any) {
        //                 console.log('Message #%d', seqno);
        //                 var prefix = '(#' + seqno + ') ';
        //                 msg.on('body', function (stream: any, info: any) {
        //                     var buffer = '';
        //                     stream.on('data', function (chunk: any) {
        //                         buffer += chunk.toString('utf8');
        //                     });
        //                     stream.once('end', function () {
        //                         console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        //                     });
        //                 });
        //                 msg.once('attributes', function (attrs: any) {
        //                     console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        //                 });
        //                 msg.once('end', function () {
        //                     console.log(prefix + 'Finished');
        //                 });
        //             });
        //         });
        //     });

        //     imap.once('error', function (err: any) {
        //         console.log(err);
        //         // reject(err);
        //     });

        //     imap.once('end', function () {
        //         console.log('Connection ended');
        //     });

        //     imap.connect();
        // });
    })

    it('read selected mailbox', async () => {
        // let mails = await imapFace.openMail('INBOX');
        // // console.log(mails);
        // assert(mails.length > 0);
    })
})
