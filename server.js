const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');
const express = require('express');
const app = express();
const cors = require('cors');
const url = require('url');
const proxy = httpProxy.createProxyServer({
    target: {
        https: true
    }
});
const setCookie = require('set-cookie-parser');

const accessControlHeaderKeywords = ['token', 'secret', 'csrf'];

let cookies = [];
proxy.on('proxyRes', function (proxyRes, req, res) {
    let accessControlHeaders = Object.keys(proxyRes.headers).filter(header => {
        for (let i = 0; i < accessControlHeaderKeywords.length; i++) {
            if (header.includes(accessControlHeaderKeywords[i])) {
                return true;
            }
        }
        return false;
    });

    cookies = setCookie.parse(proxyRes, {
        decodeValues: true  // default: true
    });

    cookies = cookies.filter(cookie => {
        for (let i = 0; i < accessControlHeaderKeywords.length; i++) {
            if (cookie.name.includes(accessControlHeaderKeywords[i])) {
                return true;
            }
        }
    }).map(cookie => {
        return cookie.name + '=' + cookie.value;
    });

    res.setHeader('Access-Control-Expose-Headers', accessControlHeaders.join(','));
});

/**
 * 
 * @param {String} target
 * @param {Number} port
 */
exports.startServer = (target, port) => {
    app.use(cors());
    app.use((req, res, next) => {
        if(cookies.length) {
            req.headers.cookie = cookies.join('; ');
        }
        proxy.proxyRequest(req, res, {
            target: target,
            agent: (target.startsWith('https') ? https : http).globalAgent,
            headers: {
                host: url.parse(target).hostname
            }
        });
    });

    let server = new http.createServer(app).listen(port, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`proxying request to ${target} on port ${port}`);
        }
    });
};