//const veilarbStatus = require('../lenker.ts');
//const veilarbStatus =  require("../lenker.ts").veilarbStatus;

const proxy = require('http-proxy-middleware');

const veilarbStatusProxyConfig = {
    changeOrigin: true,
    target: "https://tjenester-q1.nav.no",
        pathRewrite: {
    '^/ditt-nav-arbeidsgiver': '',
},
    secure: true,
    xfwd: true
};


module.exports = proxy(veilarbStatusProxyConfig);
