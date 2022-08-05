import * as chai from 'chai';
import ImapFace from '../sdk/imap';
import { assert } from 'chai';
import { DISPLAY_KEY, IMAP_PORT_KEY, IMAP_SERVER_KEY, PASS_KEY, USER_KEY } from '../strategy';
let { web: { client_id, client_secret, refresh_token } } = require('./client_secret') // the client_secret.json file
var xoauth2 = require("xoauth2"),
    xoauth2gen;
var Imap = require('node-imap');
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

    it('getBoxes', async () => {
        // let b = await imap.getBoxesAsync();
        // // console.log(b);
        // assert(Object.keys(b.length > 0));
        
        let xoauth2gen = xoauth2.createXOAuth2Generator({
            user: 'bugu1986@gmail.com', // the email address
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: refresh_token
        })

        xoauth2gen.getToken(function (err: any, xoauth2token: any) {
            if (err) {
                return console.log(err)
            }

            let imap = new Imap({
                xoauth2: xoauth2token,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                authTimeout: 10000,
                debug: console.log,
            })

            imap.connect();
        });
    })

    it('read selected mailbox', async () => {
        // let mails = await imapFace.openMail('INBOX');
        // // console.log(mails);
        // assert(mails.length > 0);
    })
})
