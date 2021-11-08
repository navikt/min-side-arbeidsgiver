import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import mustacheExpress from 'mustache-express';
import httpProxyMiddleware from 'http-proxy-middleware';
import jsdom from 'jsdom';
import Prometheus from 'prom-client';
import require from './esm-require.js';
import cookieParser from 'cookie-parser';
const jwt = require('jsonwebtoken')

const { createLogger, transports, format } = require('winston');
const apiMetricsMiddleware = require('prometheus-api-metrics');
const { JSDOM } = jsdom;
const { createProxyMiddleware } = httpProxyMiddleware;

const defaultLoginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver';
const defaultDecoratorUrl = 'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&chatbot=true&level=Level4';
const {
    PORT = 3000,
    NAIS_APP_IMAGE = '?',
    GIT_COMMIT = '?',
    LOGIN_URL = defaultLoginUrl,
    DECORATOR_EXTERNAL_URL = defaultDecoratorUrl,
    NAIS_CLUSTER_NAME = 'local',
    API_GATEWAY = 'http://localhost:8080',
    BRUKER_API_URL = 'http://localhost:8081',
    DECORATOR_UPDATE_MS = 30 * 60 * 1000,
    PROXY_LOG_LEVEL = 'info',
    ARBEIDSFORHOLD_DOMAIN = 'http://localhost:8080',
    APIGW_TILTAK_HEADER,
    SYKEFRAVAER_DOMAIN,
} = process.env;
const log = createLogger({
    transports: [
        new transports.Console({
            timestamp: true,
            format: format.json(),
        }),
    ],
});

const decoratorUrl = NAIS_CLUSTER_NAME === 'prod-gcp' ? defaultDecoratorUrl : DECORATOR_EXTERNAL_URL;
const BUILD_PATH = path.join(process.cwd(), '../build');
const getDecoratorFragments = async () => {
    const response = await fetch(decoratorUrl);
    const body = await response.text();
    const { document } = new JSDOM(body).window;
    return {
        HEADER: document.getElementById('header-withmenu').innerHTML,
        FOOTER: document.getElementById('footer-withmenu').innerHTML,
        STYLES: document.getElementById('styles').innerHTML,
        SCRIPTS: document.getElementById('scripts').innerHTML,
        SETTINGS: `<script type="application/javascript">
            window.environment = {
                MILJO: '${NAIS_CLUSTER_NAME}',
                NAIS_APP_IMAGE: '${NAIS_APP_IMAGE}',
                GIT_COMMIT: '${GIT_COMMIT}',
            }
        </script>`,
    };
};
const startApiGWGauge = () => {
    const gauge = new Prometheus.Gauge({
        name: 'backend_api_gw',
        help: 'Status til backend via API-Gateway (sonekrysning). up=1, down=0',
    });

    setInterval(async () => {
        try {
            const res = await fetch(`${API_GATEWAY}/ditt-nav-arbeidsgiver-api/internal/actuator/health`);
            gauge.set(res.ok ? 1 : 0);
            log.info(`healthcheck: ${gauge.name} ${res.ok}`);
        } catch (error) {
            log.error(`healthcheck error: ${gauge.name} ${error}`);
            gauge.set(0);
        }
    }, 60 * 1000);
};

const app = express();
app.disable('x-powered-by');
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', BUILD_PATH);
app.use(cookieParser());

app.use('/*', (req, res, next) => {
    res.setHeader('NAIS_APP_IMAGE', NAIS_APP_IMAGE);
    next();
});

app.use(
    apiMetricsMiddleware({
        metricsPath: '/min-side-arbeidsgiver/internal/metrics',
    }),
);

app.use(`/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler`,
    createProxyMiddleware({
        logLevel: PROXY_LOG_LEVEL,
        logProvider: _ => log,
        onError: (err, req, res) => {
            log.error(`${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`);
        },
        changeOrigin: true,
        pathRewrite: {
            '^/min-side-arbeidsgiver/': '/',
        },
        secure: true,
        xfwd: true,
        target: NAIS_CLUSTER_NAME === 'prod-gcp' ? 'https://api-gw.oera.no': 'https://api-gw-q0.oera.no',
        ...(APIGW_TILTAK_HEADER ? {headers: {'x-nav-apiKey': APIGW_TILTAK_HEADER}} : {})
    }),
);

app.use(
    '/min-side-arbeidsgiver/api/antall-arbeidsforhold/',
    createProxyMiddleware({
        logLevel: PROXY_LOG_LEVEL,
        logProvider: _ => log,
        onError: (err, req, res) => {
            log.error(`${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`);
        },
        changeOrigin: true,
        pathRewrite: {
            '^/min-side-arbeidsgiver': 'arbeidsforhold/arbeidsgiver-arbeidsforhold',
        },
        secure: true,
        xfwd: true,
        target: ARBEIDSFORHOLD_DOMAIN,
    }),
);

app.use(
    '/min-side-arbeidsgiver/api',
    createProxyMiddleware({
        logLevel: PROXY_LOG_LEVEL,
        logProvider: _ => log,
        onError: (err, req, res) => {
            log.error(`${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`);
        },
        changeOrigin: true,
        pathRewrite: {
            '^/min-side-arbeidsgiver/api': '/ditt-nav-arbeidsgiver-api/api',
        },
        secure: true,
        xfwd: true,
        target: API_GATEWAY,
    }),
);


app.use(
    '/min-side-arbeidsgiver/notifikasjon/api/graphql',
    createProxyMiddleware({
        target: BRUKER_API_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/min-side-arbeidsgiver/notifikasjon': '',
        },
        secure: true,
        xfwd: true,

        logLevel: PROXY_LOG_LEVEL,
        logProvider: _ => log,
        onError: (err, req, res) => {
            log.error(`${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`);
        },
        onProxyReq: (proxyReq, req, _res) => {
            proxyReq.setHeader('Authorization', `Bearer ${req.cookies['selvbetjening-idtoken']}`);
        },
    }),
);

app.use(
    '/min-side-arbeidsgiver/sykefravaer',
    createProxyMiddleware({
        target: SYKEFRAVAER_DOMAIN,
        changeOrigin: true,
        pathRewrite: {
            '^/min-side-arbeidsgiver/sykefravaer': '/sykefravarsstatistikk/api/',
        },
        secure: true,
        xfwd: true,

        logLevel: PROXY_LOG_LEVEL,
        logProvider: _ => log,
        onError: (err, req, res) => {
            log.error(`${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`);
        },
        onProxyReq: (proxyReq, req, _res) => {
            proxyReq.setHeader('Authorization', `Bearer ${req.cookies['selvbetjening-idtoken']}`);
        },
    }),
);

app.get('/min-side-arbeidsgiver/abtest', (req, res) => {
    const idtoken = req.cookies['selvbetjening-idtoken']
    const decoded = jwt.decode(idtoken);
    const fnr = decoded.sub
    const utfall = parseInt(fnr.substring(8)) % 2 === 0;
    res.send(utfall);
});

app.use('/min-side-arbeidsgiver/', express.static(BUILD_PATH, { index: false }));

app.get('/min-side-arbeidsgiver/redirect-til-login', (req, res) => {
    res.redirect(LOGIN_URL);
});
app.get(
    '/min-side-arbeidsgiver/internal/isAlive',
    (req, res) => res.sendStatus(200),
);
app.get(
    '/min-side-arbeidsgiver/internal/isReady',
    (req, res) => res.sendStatus(200),
);

const serve = async () => {
    let fragments;
    try {
        fragments = await getDecoratorFragments();
        app.get('/min-side-arbeidsgiver/*', (req, res) => {
            res.render('index.html', fragments, (err, html) => {
                if (err) {
                    log.error(err);
                    res.sendStatus(500);
                } else {
                    res.send(html);
                }
            });
        });
        app.listen(PORT, () => {
            log.info(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        log.error(`Server failed to start ${error}`);
        process.exit(1);
    }

    startApiGWGauge();
    setInterval(() => {
        getDecoratorFragments()
            .then(oppdatert => {
                fragments = oppdatert;
                log.info(`dekoratør oppdatert: ${Object.keys(oppdatert)}`);
            })
            .catch(error => {
                log.warn(`oppdatering av dekoratør feilet: ${error}`);
            });
    }, DECORATOR_UPDATE_MS);
};

serve().then(/*noop*/);

if (NAIS_CLUSTER_NAME === 'labs-gcp') {
    import('@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock');
}