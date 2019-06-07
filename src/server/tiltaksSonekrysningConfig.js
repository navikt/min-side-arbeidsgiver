import {hentArbeidsavtalerApiLink} from "../lenker";

const proxy = require('http-proxy-middleware');

const envProperties = {
    API_GATEWAY: process.env.Q0API_GATEWAY || process.env.API_GATEWAY ||'http://localhost:8080',
    APIGW_TILTAK_HEADER: process.env.APIGW_TILTAK_HEADER

};
const tiltaksURL = () => {
    if (process.env.NAIS_CLUSTER_NAME === "prod-sbs") {
        return "https://tjenester.nav.no/";
    } else {
        return "https://tjenester-q1.nav.no/";
    }
};

const tiltakSonekrysningConfig = {
    changeOrigin: true,
    target: envProperties.API_GATEWAY,
    pathRewrite: {
        '^/ditt-nav-arbeidsgiver': '',
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

/*
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
*/
