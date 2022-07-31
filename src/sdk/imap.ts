import * as Imap from 'node-imap';
import * as vscode from 'vscode';
const bluebird = require('bluebird');
const inspect = require('util').inspect;
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
        let start = box.messages.total - 2;
        return new Promise((resolve,reject) => {
            let f = this.imap.seq.fetch(start + ':' + box.messages.total, { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'] });
            let mails: Message[] = [];
            f.on('message', function (msg: any, seqno: any) {
                console.log('Message #%d', seqno);
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream: any, info: any) {
                    if (info.which === 'TEXT')
                        console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
                    var buffer = '', count = 0;
                    stream.on('data', function (chunk: any) {
                        count += chunk.length;
                        buffer += chunk.toString('utf8');
                        if (info.which === 'TEXT')
                            console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
                    });
                    stream.once('end', function () {
                        if (info.which !== 'TEXT')
                            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                        else
                            console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                    });
                });
                msg.once('attributes', function (attrs: any) {
                    console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                });
                msg.once('end', function () {
                    console.log(prefix + 'Finished');
                    mails.push(new Message('name', NodeType.Mail))
                });
            });
            f.once('end', () => {
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
    public constructor(public readonly label: string,
        public readonly type: NodeType,) { 
    }
}