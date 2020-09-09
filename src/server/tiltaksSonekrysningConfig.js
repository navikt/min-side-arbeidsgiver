const proxy = require('http-proxy-middleware');

const envProperties = {
    API_GATEWAY: process.env.Q0API_GATEWAY || process.env.API_GATEWAY ||'http://localhost:8080',
    APIGW_TILTAK_HEADER: process.env.APIGW_TILTAK_HEADER

};
const tiltakSonekrysningConfig = {
    changeOrigin: true,
    target: envProperties.API_GATEWAY,
    pathRewrite: {
        '^/min-side-arbeidsgiver/': '/',
    },
    secure: true,
    xfwd: true
};

if (envProperties.APIGW_TILTAK_HEADER) {
    tiltakSonekrysningConfig.headers = {
        'x-nav-apiKey': envProperties.APIGW_TILTAK_HEADER,
    };
}

module.exports = proxy(tiltakSonekrysningConfig);
