const bluebird = require('bluebird');
let { installed: { client_id, client_secret } } = require('./client_secret');
var xoauth2 = require("xoauth2");
const http = require("http"); 
const url = require('url');
const fetch = require('node-fetch');         
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
    let geted = false;
    const requestListener = async function (req: any, res: any) {
        if (geted){
            return;
        }
        // 1. access https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A3000&prompt=consent&response_type=code&client_id=106957458440-ectevvqgch5o9pq0jm8lrbfeab9nu23d.apps.googleusercontent.com&scope=https%3A%2F%2Fmail.google.com%2F+https%3A%2F%2Fmail.google.com%2F&access_type=offline
        // 2. google callback http://localhost:3000/code?code=4/0AdQt8qi-2r6IEG5ribqzQ5xn48EtektGPRlrL9PJ-C7IMdLU35nqUZMt83pWM2aRvMJkIg&scope=https://mail.google.com/
        let qurey = url.parse(req.url, true).query;
                console.log('get code ' + qurey.code);
                // TODO fetch google by form
                var details = {
                    'code': qurey.code,
                    'redirect_uri': 'http://localhost:3000',
                    'client_id': client_id,
                    'client_secret': client_secret,
                    'grant_type': 'authorization_code',
                    'scope': ''
                };

                var formBody: string[] = [];
                Object.entries(details)
                    .forEach(([key, value]) => {
                        var encodedKey = encodeURIComponent(key);
                        var encodedValue = encodeURIComponent(value);
                        formBody.push(encodedKey + "=" + encodedValue);
                    })

                let formBodyStr = formBody.join("&");
                console.log(formBodyStr);
                geted = true;

                let response = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: formBodyStr
                });
                const data = await response.json();

                console.log(data);
                /**
                 * POST /token HTTP/1.1
Host: oauth2.googleapis.com
Content-length: 317
content-type: application/x-www-form-urlencoded
user-agent: google-oauth-playground
code=4%2F0AdQt8qit1Qkn2olvMsIRORcmvYe7u4lbFLVXdbrKXOwnRyUvwZiOyuuh-Lqnq6xJs3exHA&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftoken&client_id=106957458440-ectevvqgch5o9pq0jm8lrbfeab9nu23d.apps.googleusercontent.com&client_secret=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&scope=&grant_type=authorization_code
                 */
                // TODO get refresh token from fetch response
                /**
                 * {
  "access_token": "ya29.A0AVA9y1v9WGHtyqMhmwnF9iAtDdXMTUBhI5OHRLpJUOagvTFgZEFASc7yI-0dnQpaR-ecHvBGRUnw7LY2UwvmDgUtpmyEHAnQhJzNRBXNpEea-BMreMcOOzIj3PaIKXOg1d35llhiKqUn3NF4Y5eW5ou3POomaCgYKATASATASFQE65dr8uZcih3hQ6j9n3fSP07Kc0w0163", 
  "scope": "https://mail.google.com/", 
  "token_type": "Bearer", 
  "expires_in": 3599, 
  "refresh_token": "1//04fsdXDXkfP0qCgYIARAAGAQSNwF-L9Ir24YLooxY0o64NWQqZTV5ZiTMvEAR7QWYhd_LKIeccP3dxa7wOX0taoPPhheqJR-yB3E"
}
                 */
                // TODO save user and refresh token to vsc
                res.writeHead(200);
                res.end();
    }

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}
