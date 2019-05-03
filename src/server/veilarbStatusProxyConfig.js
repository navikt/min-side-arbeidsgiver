
const proxy = require('http-proxy-middleware');

const veilarbStatus = () => {
    if (process.env.NAIS_CLUSTER_NAME === "prod-sbs") {
        return "https://tjenester.nav.no/";
    } else {
        return "https://tjenester-q1.nav.no/";
    }
};


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
