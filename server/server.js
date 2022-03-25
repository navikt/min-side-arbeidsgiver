import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import Mustache from 'mustache';
import httpProxyMiddleware from 'http-proxy-middleware';
import Prometheus from 'prom-client';
import {createLogger, format, transports} from 'winston';
import cookieParser from 'cookie-parser';
import * as FS from 'fs';
import require from './esm-require.js';

const apiMetricsMiddleware = require('prometheus-api-metrics');
const { createProxyMiddleware } = httpProxyMiddleware;

const defaultLoginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver';
const {
    PORT = 3000,
    NAIS_APP_IMAGE = '?',
    GIT_COMMIT = '?',
    LOGIN_URL = defaultLoginUrl,
    NAIS_CLUSTER_NAME = 'local',
    API_GATEWAY = 'http://localhost:8080',
    PROXY_LOG_LEVEL = 'info',
    ARBEIDSFORHOLD_DOMAIN = 'http://localhost:8080',
    APIGW_TILTAK_HEADER,
    SYKEFRAVAER_DOMAIN = 'http://localhost:8080',
} = process.env;

const log = createLogger({
    transports: [
        new transports.Console({
            timestamp: true,
            format: format.json(),
        }),
    ],
});

const BUILD_PATH = path.join(process.cwd(), '../build');

const indexHtml = Mustache.render(
    FS.readFileSync("/usr/src/app/build/index.html"),
    {
        SETTINGS: `<script type="application/javascript">
            window.environment = {
                MILJO: '${NAIS_CLUSTER_NAME}',
                NAIS_APP_IMAGE: '${NAIS_APP_IMAGE}',
                GIT_COMMIT: '${GIT_COMMIT}',
            }
        </script>`
    }
);

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

if (NAIS_CLUSTER_NAME === 'dev-gcp') {
    require('./mock/enhetsRegisteretMock').mock(app)
}
if (NAIS_CLUSTER_NAME === 'labs-gcp') {
    require('./mock/enhetsRegisteretMock').mock(app);
    require('./mock/altinnMock').mock(app);
    require('./mock/altinnMeldingsboksMock').mock(app);
    require('./mock/antallArbeidsforholdMock').mock(app);
    require('./mock/pamMock').mock(app);
    require('./mock/tiltakApiMock').mock(app);
    require('./mock/sykefraværMock').mock(app);
}

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
    }),
);

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
    try {
        app.get('/min-side-arbeidsgiver/*', indexHtml);
        // (req, res) => {
        //     res.send(indexHtml);
        // });
        app.listen(PORT, () => {
            log.info(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        log.error(`Server failed to start ${error}`);
        process.exit(1);
    }

    startApiGWGauge();
};

serve().then(/*noop*/);

if (NAIS_CLUSTER_NAME === 'labs-gcp') {
    import('@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock');
}