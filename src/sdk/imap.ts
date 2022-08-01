import * as Imap from 'node-imap';
import * as vscode from 'vscode';
const bluebird = require('bluebird');
const inspect = require('util').inspect;
const simpleParser = require('mailparser').simpleParser;
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 
const LOAD_MAIL = 5;
class ImapFace {
    private imap: any;
    /**
     * constructor
     */
    public constructor() {
        this.imap = bluebird.promisifyAll(new Imap({
            user: 'bugu1986@126.com',
            password: 'UMXTDSXKNLBRSSOB',
            host: 'imap.126.com',
            port: 993,
            tls: true,
            tlsOptions: { servername: 'imap.126.com' },
            // debug: console.log,
            id: {
                name: 'myemail',
                version: '1.0.0',
                vendor: "myclient",
                "support-email": 'bugu1986@126.com',
            },
        } as any));
    }
    /**
     * connect
     */
    public connect(ready?: (imap: any) => void): any {
        let imap = this.imap;
        imap.once('ready', function () {
            if(ready) {
                ready(imap);
            }
        });

        this.imap.once('error', function (err: any) {
            console.log(err);
        });

        this.imap.once('end', function () {
            console.log('Connection ended');
        });
        this.imap.connect();
        return imap;
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
                    await delay(500);
                }
                resolve(mails);
            })
        });
    }

}

let imap = new ImapFace();

export default imap;

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