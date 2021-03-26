import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import mustacheExpress from 'mustache-express';
import httpProxyMiddleware from "http-proxy-middleware";
import jsdom from "jsdom";
import Prometheus from "prom-client";
import require from "./esm-require.js";

const {createLogger, transports, format} = require('winston');
const apiMetricsMiddleware = require('prometheus-api-metrics');
const {JSDOM} = jsdom;
const {createProxyMiddleware} = httpProxyMiddleware;

const defaultLoginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver';
const defaultDecoratorUrl = 'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&chatbot=true&level=Level4';
const {
    PORT = 3000,
    NAIS_APP_IMAGE = '?',
    LOGIN_URL = defaultLoginUrl,
    DECORATOR_EXTERNAL_URL = defaultDecoratorUrl,
    NAIS_CLUSTER_NAME = 'local',
    API_GATEWAY = 'http://localhost:8080',
    APIGW_HEADER,
    BRUKER_API_URL,
    DECORATOR_UPDATE_MS = 30 * 60 * 1000,
    PROXY_LOG_LEVEL = 'info',
} = process.env;
const log = createLogger({
    transports: [
        new transports.Console({
            timestamp: true,
            format: format.json()
        })
    ]
})

const decoratorUrl = NAIS_CLUSTER_NAME === 'prod-sbs' ? defaultDecoratorUrl : DECORATOR_EXTERNAL_URL;
const BUILD_PATH = path.join(process.cwd(), '../build');
const getDecoratorFragments = async () => {
    const response = await fetch(decoratorUrl);
    const body = await response.text();
    const {document} = new JSDOM(body).window;
    return {
        HEADER: document.getElementById('header-withmenu').innerHTML,
        FOOTER: document.getElementById('footer-withmenu').innerHTML,
        STYLES: document.getElementById('styles').innerHTML,
        SCRIPTS: document.getElementById('scripts').innerHTML,
        SETTINGS: `<script type="application/javascript">
            window.environment = {
                MILJO: '${NAIS_CLUSTER_NAME}',
                BRUKER_API_URL: '${BRUKER_API_URL}',
            }
        </script>`,
    };
}
const startApiGWGauge = () => {
    const gauge = new Prometheus.Gauge({
        name: 'backend_api_gw',
        help: 'Status til backend via API-Gateway (sonekrysning). up=1, down=0',
    });

    setInterval(async () => {
        try {
            const res = await fetch(`${API_GATEWAY}/ditt-nav-arbeidsgiver-api/internal/actuator/health`, {
                ...(APIGW_HEADER ? {headers: {'x-nav-apiKey': APIGW_HEADER}} : {})
            });
            gauge.set(res.ok ? 1 : 0);
            log.info(`healthcheck: ${gauge.name} ${res.ok}`);
        } catch (error) {
            log.error(`healthcheck error: ${gauge.name} ${error}`)
            gauge.set(0);
        }
    }, 60 * 1000);
}

const app = express();
app.disable("x-powered-by");
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', BUILD_PATH);

app.use('/*', (req, res, next) => {
    res.setHeader('NAIS_APP_IMAGE', NAIS_APP_IMAGE);
    next();
});
app.use(
    apiMetricsMiddleware({
        metricsPath: '/min-side-arbeidsgiver/internal/metrics',
    })
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
        ...(APIGW_HEADER ? { headers: {'x-nav-apiKey': APIGW_HEADER}} : {})
    })
);
app.use('/min-side-arbeidsgiver/', express.static(BUILD_PATH, { index: false }));

app.get('/min-side-arbeidsgiver/redirect-til-login', (req, res) => {
    res.redirect(LOGIN_URL);
});
app.get(
    '/min-side-arbeidsgiver/internal/isAlive',
    (req, res) => res.sendStatus(200)
);
app.get(
    '/min-side-arbeidsgiver/internal/isReady',
    (req, res) => res.sendStatus(200)
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
}

serve().then(/*noop*/);
