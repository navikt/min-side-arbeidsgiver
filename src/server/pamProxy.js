const proxy = require('http-proxy-middleware');

let pamUrl;
if (process.env.NAIS_CLUSTER_NAME === "dev-sbs"){
    pamUrl= "https://arbeidsplassen-q.nav.no";
} else if (process.env.NAIS_CLUSTER_NAME ==="prod-sbs"){
    pamUrl="https://arbeidsplassen.nav.no";
} else {
    pamUrl = "http://localhost:8080";
}

const proxyConfig = {
    changeOrigin: true,
    target: pamUrl,
    pathRewrite: {
        '^/ditt-nav-arbeidsgiver/pam': '',
    },
    secure: true,
    xfwd: true
};

module.exports = proxy(proxyConfig);