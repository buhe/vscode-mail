const bluebird = require('bluebird');
let { installed: { client_id, client_secret } } = require('./client_secret');
var xoauth2 = require("xoauth2");
const http = require("http"); 
const url = require('url');         
const host = 'localhost';
const port = 3000;

export async function getToken(user: string, refresh_token: string) {
    let xoauth2gen = xoauth2.createXOAuth2Generator({
        user: user, // the email address
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: refresh_token
    });
    xoauth2gen = bluebird.promisifyAll(xoauth2gen);
    return await xoauth2gen.getTokenAsync();
}

export async function getCode() {
    const requestListener = function (req: any, res: any) {
        let pathname = url.parse(req.url).pathname;
        let qurey = url.parse(req.url, true).query;
        console.log('landing ' + pathname + qurey.code);
        // res.setHeader("Content-Type", "application/json");
        // console.log(JSON.stringify(req));
        switch (pathname) {
            case "/code":
                console.log('get code ' + qurey.code);
                res.writeHead(200);
                res.end();
                break
        }
    }

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}

export async function getRefreshToken() {
    
}

interface Browen {
    open(url: string): any;
}