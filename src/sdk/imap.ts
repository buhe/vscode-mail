var Imap = require('imap');

export default class ImapFace {

    /**
     * connect
     */
    public connect() {
        var imap = new Imap({
            user: 'bugu1986@gmail.com',
            password: '&pAdkpYt7GNLJ1@Z',
            host: 'imap.gmail.com',
            port: 993,
            tls: true
        });

        function openInbox(cb: any) {
            imap.openBox('INBOX', true, cb);
        }

        imap.once('ready', function () {
            openInbox(function (err: any, box: any) {
                if (err) throw err;
                var f = imap.seq.fetch('1:3', {
                    bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                    struct: true
                });
                f.on('message', function (msg: any, seqno: any) {
                    console.log('Message #%d', seqno);
                    var prefix = '(#' + seqno + ') ';
                    msg.on('body', function (stream: any, info: any) {
                        var buffer = '';
                        stream.on('data', function (chunk: any) {
                            buffer += chunk.toString('utf8');
                        });
                        stream.once('end', function () {
                            console.log(prefix + 'Parsed header: %s', Imap.parseHeader(buffer));
                        });
                    });
                    msg.once('attributes', function (attrs: any) {
                        console.log(prefix + 'Attributes: %s', attrs);
                    });
                    msg.once('end', function () {
                        console.log(prefix + 'Finished');
                    });
                });
                f.once('error', function (err: any) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function () {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });

        imap.once('error', function (err: any) {
            console.log(err);
        });

        imap.once('end', function () {
            console.log('Connection ended');
        });

        imap.connect();
    }
}