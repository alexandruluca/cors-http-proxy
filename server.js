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

const accessControlHeaderKeywords = ['token', 'secret', 'csrf'];

proxy.on('proxyRes', function(proxyRes, req, res) {
    let accessControlHeaders = Object.keys(proxyRes.headers).filter(header => {
        for(let i = 0; i < accessControlHeaderKeywords.length; i++) {
            if(header.includes(accessControlHeaderKeywords[i])) {
                return true;
            }
        }
        return false;
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
        proxy.proxyRequest(req, res, {
            target: target,
            agent  : https.globalAgent,
            headers: {
                host: url.parse(target).hostname
            }
        });
    });

    let server = new http.createServer(app).listen(port, function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log(`proxying request to ${target} on port ${port}`);
        }
    });
};