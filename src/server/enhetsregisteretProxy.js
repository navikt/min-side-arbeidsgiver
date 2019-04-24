const proxy = require('http-proxy-middleware');

let enhetsregisteretUrl = "https://data.brreg.no/enhetsregisteret/api/enheter"

const proxyConfig = {
    changeOrigin: true,
    target: enhetsregisteretUrl,
    pathRewrite: {
        '^/ditt-nav-arbeidsgiver/enhetsregisteret': '/',
    },
    secure: true,
    xfwd: true
};

module.exports = proxy(proxyConfig);