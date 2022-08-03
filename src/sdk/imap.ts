import * as Imap from 'node-imap';
import { IMAP_PORT_KEY, IMAP_SERVER_KEY, PASS_KEY, USER_KEY } from '../strategy';
const bluebird = require('bluebird');
const inspect = require('util').inspect;
const simpleParser = require('mailparser').simpleParser;
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 
const LOAD_MAIL = 15;
class ImapFace {
    private imap: any;
    /**
     * constructor
     */
    public constructor(config: any) {
        this.imap = bluebird.promisifyAll(new Imap({
            user: config[USER_KEY],
            password: config[PASS_KEY],
            host: config[IMAP_SERVER_KEY],
            port: config[IMAP_PORT_KEY],
            tls: true,
            tlsOptions: { servername: config[IMAP_SERVER_KEY] },
            // debug: console.log,
            id: {
                name: 'vsc-mail',
                version: '1.0.0',
                vendor: "buhe",
                "support-email": config[USER_KEY],
            },
        } as any));
    }
    /**
     * connect
     */
    public async connect(): Promise<any> {
        return new Promise((resolve,reject) => {
            let out = this;
            this.imap.once('ready', function () {
                resolve(out.imap);
            });

            this.imap.once('error', function (err: any) {
                console.log(err);
                reject(err);
            });

            this.imap.once('end', function () {
                console.log('Connection ended');
            });
            this.imap.connect();
        })
        
    }

    /**
     * openMail
     */
    public async openMail(boxName: string): Promise<Message[]> {
        let box = await this.imap.openBoxAsync(boxName, true);
        let start = box.messages.total + 1 - LOAD_MAIL;
        if(start < 0){
            start = 1;
        }
        const mailCounts = box.messages.total + 1 - start;
        return new Promise((resolve,reject) => {
            let f = this.imap.seq.fetch(start + ':' + box.messages.total, { bodies: ''});
            let mails: Message[] = [];
            f.on('message', function (msg: any, seqno: any) {
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream: any, info: any) {
                    simpleParser(stream, (err: any, mail: any) => { //use this
                        mails.push(new Message(mail.subject, mail.html, NodeType.Mail))
                    });
                });
                msg.once('attributes', function (attrs: any) {
                    console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                });
                msg.once('end', function () {
                    console.log(prefix + 'Finished');
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
        public readonly content: string,
        public readonly type: NodeType,) { 
    }
}