import * as Imap from 'node-imap';
import { DISPLAY_KEY, IMAP_PORT_KEY, IMAP_SERVER_KEY, PASS_KEY, TOKEN_KEY, USER_KEY, VENDOR_KEY, V_126, V_GMAIL } from '../strategy';
import Cache from './cache';
import { getToken } from './gmail/token';
const bluebird = require('bluebird');
const simpleParser = require('mailparser').simpleParser;
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 
const LOAD_MAIL = 10;
class ImapFace {
    private imap: any;
    private cache?: Cache;
    /**
     * constructor
     */
    public constructor() {
        
    }

    /**
     * init
     */
    public async init(config: any) {
        switch (config[VENDOR_KEY]) {
            case V_GMAIL:
                let token = await getToken(config[USER_KEY], config[TOKEN_KEY]);
                this.imap = bluebird.promisifyAll(new Imap({
                    xoauth2: token,
                    host: config[IMAP_SERVER_KEY],
                    port: config[IMAP_PORT_KEY],
                    tls: true,
                    tlsOptions: { servername: config[IMAP_SERVER_KEY] },
                    debug: console.log,
                    id: {
                        name: 'vsc-mail',
                        version: '1.0.0',
                        vendor: "buhe",
                        "support-email": config[USER_KEY],
                    },
                } as any));
                
                break;

            case V_126:
                this.imap = bluebird.promisifyAll(new Imap({
                    user: config[USER_KEY],
                    password: config[PASS_KEY],
                    host: config[IMAP_SERVER_KEY],
                    port: config[IMAP_PORT_KEY],
                    tls: true,
                    tlsOptions: { servername: config[IMAP_SERVER_KEY] },
                    debug: console.log,
                    id: {
                        name: 'vsc-mail',
                        version: '1.0.0',
                        vendor: "buhe",
                        "support-email": config[USER_KEY],
                    },
                } as any));
                break;
        }

        this.cache = new Cache(config[DISPLAY_KEY]);
    }
    /**
     * connect
     */
    public async connect(): Promise<any> {
        let out = this;
        return new Promise((resolve,reject) => {
            
            out.imap.once('ready', function () {
                resolve(out.imap);
            });

            out.imap.once('error', function (err: any) {
                console.log(err);
                reject(err);
            });

            out.imap.once('end', function () {
                console.log('Connection ended');
            });
            out.imap.connect();
        })
        
    }

    /**
     * openMail
     */
    public async openMail(boxName: string): Promise<Message[]> {
        let box = await this.imap.openBoxAsync(boxName, false);
        let start = box.messages.total + 1 - LOAD_MAIL;
        if(start < 0){
            start = 1;
        }
        let out = this;
        const mailCounts = box.messages.total + 1 - start;
        return new Promise((resolve,reject) => {
            let f = out.imap.seq.fetch(start + ':' + box.messages.total, { bodies: ''});
            let mails: Message[] = [];
            f.on('message', function (msg: any, seqno: any) {
                var prefix = '(#' + seqno + ') ';
                let mail: any = {};
                let uid: number;
                let parsed = false;
                msg.on('body',async function (stream: any, info: any) {
                    // 1
                    console.log(prefix+ '1 ' + JSON.stringify(info));
                    mail = await simpleParser(stream);
                    mail.from = mail.from['value'][0]['address'];
                    // 3
                    // console.log(prefix + JSON.stringify(mail) + '3 Parsed');
                    await out.cache!.setCache(uid, mail.subject, mail.from, mail.html);
                    parsed = true;
                });
                msg.once('attributes', async function (attrs: any) {
                    // 2
                    console.log(prefix + '2 Attributes: %s', JSON.stringify(attrs));
                    console.log(prefix + '2 uid: %s', attrs['uid']);
                    uid = attrs['uid']; // uid from attrs
                    // check cache, set parsed to true, read cache to mail object.
                    if(await out.cache!.hasCache(uid)) {
                        let c = await out.cache!.getCache(uid);
                        mail.subject = c[0];
                        mail.from = c[1];
                        mail.html = c[2];
                        parsed = true;
                    }
                    // TODO read/write flags.
                });
                msg.once('end', async function () {
                    // mail maybe begin parse, but not full parsed. Attributes must parsed.
                    // so, we need to wait mail parsed or hit cache.
                    while(!parsed) {
                        await delay(100);
                    }
                    console.log(prefix + 'Finished');
                    mails.push(new Message(mail.subject, mail.from, mail.html, NodeType.Mail, []))
                });
            });
            f.once('end', async () => {
                // wait for parse all mails
                while(mails.length !== mailCounts) {
                    await delay(100);
                }
                resolve(mails);
            })
        });
    }

}

// let imap = new ImapFace();

export default ImapFace;

export enum NodeType {
    Vendor,
    Box,
    Mail,
}
export class Message {

    /**
     * constructor
     */
    public constructor(public readonly subject: string,
        public readonly from: string,
        public readonly content: string,
        public readonly type: NodeType,
        public readonly tags: string[]) { 
    }
}