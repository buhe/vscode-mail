import * as Imap from 'node-imap';
const bluebird = require('bluebird');
const inspect = require('util').inspect;
class ImapFace {
    private imap: Imap;
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
        // function openInbox(cb: any) {
        //     imap.openBox('INBOX', true, cb);
        // }

        imap.once('ready', function () {
            if(ready) {
                ready(imap);
            }
            // console.log('ready..............');
            // return Promise.resolve('');
            // imap.getBoxes((e: any, boxes: any) => {
            //     console.log(boxes);
            // });
            // openInbox(function (err: any, box: any) {
            //     if (err) throw err;
            //     var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'] });
            //     f.on('message', function (msg, seqno) {
            //         console.log('Message #%d', seqno);
            //         var prefix = '(#' + seqno + ') ';
            //         msg.on('body', function (stream, info) {
            //             if (info.which === 'TEXT')
            //                 console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
            //             var buffer = '', count = 0;
            //             stream.on('data', function (chunk) {
            //                 count += chunk.length;
            //                 buffer += chunk.toString('utf8');
            //                 if (info.which === 'TEXT')
            //                     console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
            //             });
            //             stream.once('end', function () {
            //                 if (info.which !== 'TEXT')
            //                     console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
            //                 else
            //                     console.log(prefix + 'Body [%s] Finished', inspect(info.which));
            //             });
            //         });
            //         msg.once('attributes', function (attrs) {
            //             console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            //         });
            //         msg.once('end', function () {
            //             console.log(prefix + 'Finished');
            //         });
            //     });
            //     f.once('error', function (err) {
            //         console.log('Fetch error: ' + err);
            //     });
            //     f.once('end', function () {
            //         console.log('Done fetching all messages!');
            //         imap.end();
            //     });
            // });
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

}

let imap = new ImapFace();

export default imap;