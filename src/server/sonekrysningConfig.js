const proxy = require('http-proxy-middleware');
const BASE_PATH= '/ditt-nav-arbeidsgiver';


const envProperties = {
    API_GATEWAY: process.env.API_GATEWAY || 'http://localhost:8080',
    APIGW_HEADER: process.env.APIGW_HEADER,
};

const proxyConfig = {
    changeOrigin: true,
    target: envProperties.API_GATEWAY,
    pathRewrite: {
        '^/ditt-nav-arbeidsgiver/api': '/ditt-nav-arbeidsgiver-api/api',
    },
    secure: false,
    xfwd: true
};

if (envProperties.APIGW_HEADER) {
    proxyConfig.headers = {
        'x-nav-apiKey': envProperties.APIGW_HEADER,
    };
}

module.exports = proxy(proxyConfig);
