import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import Mustache from 'mustache';
import httpProxyMiddleware, {responseInterceptor} from 'http-proxy-middleware';
import Prometheus from 'prom-client';
import {createLogger, format, transports} from 'winston';
import cookieParser from 'cookie-parser';
import {createNotifikasjonBrukerApiProxyMiddleware, tokenXMiddleware} from "./brukerapi-proxy-middleware.js";
import {readFileSync} from 'fs';
import require from './esm-require.js';
import {applyNotifikasjonMockMiddleware} from "@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock";

const apiMetricsMiddleware = require('prometheus-api-metrics');
const {createProxyMiddleware} = httpProxyMiddleware;

const {
    PORT = 8080,
    NAIS_APP_IMAGE = '?',
    GIT_COMMIT = '?',
    LOGIN_URL = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver',
    NAIS_CLUSTER_NAME = 'local',
    BACKEND_API_URL = 'http://localhost:8080',
    PROXY_LOG_LEVEL = 'info',
    ARBEIDSFORHOLD_DOMAIN = 'http://localhost:8080',
    APIGW_TILTAK_HEADER,
    SYKEFRAVAER_DOMAIN = 'http://localhost:8080',
    MILJO = 'local',
} = process.env;

const log_events_counter = new Prometheus.Counter({
    name: 'logback_events_total',
    help: 'Antall log events fordelt på level',
    labelNames: ['level'],
});
// proxy calls to log.<level> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get
const log = new Proxy(
    createLogger({
        transports: [
            new transports.Console({
                timestamp: true,
                format: format.json(),
            }),
        ],
    }),
    {
        get: (_log, level) => {
            return (...args) => {
                log_events_counter.inc({level: `${level}`})
                return _log[level](...args);
            }
        }
    });

let BUILD_PATH = path.join(process.cwd(), '../build');
if (NAIS_CLUSTER_NAME === 'local') {
    BUILD_PATH = path.join(process.cwd(), '../public')
}

const indexHtml = Mustache.render(
    readFileSync(path.join(BUILD_PATH, "index.html")).toString(),
    {
        SETTINGS: `
            window.environment = {
                MILJO: '${MILJO}',
                NAIS_APP_IMAGE: '${NAIS_APP_IMAGE}',
                GIT_COMMIT: '${GIT_COMMIT}',
            }
        `
    }
);

const selvbetjeningsCookieAsAuthHeaderMiddleware = (req, res, next) => {
    const subject_token = req.cookies['selvbetjening-idtoken']
    if (subject_token) {
        req.headers.authorization = `Bearer ${subject_token}`
        delete req.cookies['selvbetjening-idtoken']
    }
    next();
};


const main = async () => {
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

    if (MILJO === 'dev') {
        (await import('./mock/enhetsRegisteretMock.js')).mock(app);
    }

    if (MILJO === 'local' || MILJO === 'demo') {
        (await import('./mock/innloggetMock.js')).mock(app);
        (await import('./mock/pamMock.js')).mock(app);
        (await import('./mock/syfoMock.js')).mock(app);
        (await import('./mock/altinnMock.js')).mock(app);
        (await import('./mock/altinnMeldingsboksMock.js')).mock(app);
        (await import('./mock/altinnBeOmTilgangMock.js')).mock(app);
        (await import('./mock/enhetsRegisteretMock.js')).mock(app);
        (await import('./mock/antallArbeidsforholdMock.js')).mock(app);
        (await import('./mock/tiltakApiMock.js')).mock(app);
        (await import('./mock/sykefraværMock.js')).mock(app);
        (await import('./mock/refusjonsStatusMock.js')).mock(app);
        (await import('./mock/presenterteKandidaterMock.js')).mock(app);
        (await import('./mock/featureRequestMock.js')).mock(app);

        const {applyNotifikasjonMockMiddleware} = require('@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock');

        // TODO: oppdater mock med nytt skjema ig fjern override her
        const {gql} = require("apollo-server-express");
        const data = readFileSync('../bruker.graphql');
        applyNotifikasjonMockMiddleware(
            {app, path: "/min-side-arbeidsgiver/notifikasjon-bruker-api"},
            {
                typeDefs: gql(data.toString()),

            }
        )
    } else {
        app.use(
            '/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler',
            selvbetjeningsCookieAsAuthHeaderMiddleware,
            tokenXMiddleware(
                {
                    log: log,
                    audience: {
                        'dev': 'dev-fss:arbeidsgiver:tiltaksgjennomforing-api',
                        'prod': 'prod-fss:arbeidsgiver:tiltaksgjennomforing-api',
                    }[MILJO]
                }),
            createProxyMiddleware({
                logLevel: PROXY_LOG_LEVEL,
                logProvider: _ => log,
                selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()
                onProxyRes: responseInterceptor(async (responseBuffer, proxyRes) => {
                    try {
                        if (proxyRes.statusCode >= 400) {
                            log.warn(`tiltaksgjennomforing-api/avtaler feilet ${proxyRes.statusCode}: ${proxyRes.statusMessage}`);
                            return JSON.stringify([])
                        }
                        if (proxyRes.headers['content-type'] === 'application/json') {
                            const data = JSON.parse(responseBuffer.toString('utf8'))
                                .map(elem => ({
                                    'tiltakstype': elem.tiltakstype,
                                }))
                            return JSON.stringify(data);
                        }
                    } catch (error) {
                        log.error(`tiltaksgjennomforing-api/avtaler feilet ${error}`);
                        return JSON.stringify([])
                    }
                }),
                onError: (err, req, res) => {
                    log.error(`${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`);
                },
                changeOrigin: true,
                pathRewrite: {
                    '^/min-side-arbeidsgiver/': '/',
                },
                secure: true,
                xfwd: true,
                target: NAIS_CLUSTER_NAME === 'prod-gcp' ? 'https://api-gw.oera.no' : 'https://api-gw-q0.oera.no',
                ...(APIGW_TILTAK_HEADER ? {headers: {'x-nav-apiKey': APIGW_TILTAK_HEADER}} : {})
            }),
        );

        app.use(
            '/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater',
            selvbetjeningsCookieAsAuthHeaderMiddleware,
            tokenXMiddleware(
                {
                    log: log,
                    audience: {
                        'dev': 'dev-gcp:toi:presenterte-kandidater-api',
                        'prod': 'prod-gcp:toi:presenterte-kandidater-api',
                    }[MILJO]
                }),
            createProxyMiddleware({
                logLevel: PROXY_LOG_LEVEL,
                logProvider: _ => log,
                onError: (err, req, res) => {
                    log.error(`${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`);
                },
                changeOrigin: true,
                pathRewrite: {
                    '^/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern': '/ekstern',
                },
                secure: true,
                xfwd: true,
                target: 'http://presenterte-kandidater-api.toi',
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
            selvbetjeningsCookieAsAuthHeaderMiddleware,
            tokenXMiddleware(
                {
                    log: log,
                    audience: {
                        'dev': 'dev-gcp:fager:min-side-arbeidsgiver-api',
                        'prod': 'prod-gcp:fager:min-side-arbeidsgiver-api',
                    }[MILJO]
                }),
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
                target: BACKEND_API_URL,
            })
        );

        app.use(
            '/min-side-arbeidsgiver/notifikasjon-bruker-api',
            createNotifikasjonBrukerApiProxyMiddleware({log}),
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

        app.get('/min-side-arbeidsgiver/redirect-til-login', (req, res) => {
            const target = new URL(LOGIN_URL)
            target.searchParams.set('redirect', req.get('referer'))
            res.redirect(target.href);
        });
    }

    app.use('/min-side-arbeidsgiver/', express.static(BUILD_PATH, {index: false}));

    app.get(
        '/min-side-arbeidsgiver/internal/isAlive',
        (req, res) => res.sendStatus(200),
    );
    app.get(
        '/min-side-arbeidsgiver/internal/isReady',
        (req, res) => res.sendStatus(200),
    );

    app.get('/min-side-arbeidsgiver/informasjon-om-tilgangsstyring', (req, res) => {
        res.redirect(301, 'https://www.nav.no/arbeidsgiver/tilganger')
    })

    app.get('/min-side-arbeidsgiver/*', (req, res) => {
        res.send(indexHtml);
    });



    const gauge = new Prometheus.Gauge({
        name: 'backend_api_gw',
        help: 'Hvorvidt frontend-server naar backend-server. up=1, down=0',
    });

    setInterval(async () => {
        try {
            const res = await fetch(`${BACKEND_API_URL}/ditt-nav-arbeidsgiver-api/internal/actuator/health`);
            gauge.set(res.ok ? 1 : 0);
        } catch (error) {
            log.error(`healthcheck error: ${gauge.name}`, error);
            gauge.set(0);
        }
    }, 60 * 1000);

    app.listen(PORT, () => {
        log.info(`Server listening on port ${PORT}`);
    });
}

main()
    .then(_ => log.info("main started"))
    .catch(e => log.error("main failed", e))