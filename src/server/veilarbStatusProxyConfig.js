import {veilarbStatus} from "../lenker";

const proxy = require('http-proxy-middleware');

const veilarbStatusProxyConfig = {
    changeOrigin: true,
    target: veilarbStatus(),
        pathRewrite: {
    '^/ditt-nav-arbeidsgiver': '',
},
    secure: true,
    xfwd: true
};


module.exports = proxy(veilarbStatusProxyConfig);
