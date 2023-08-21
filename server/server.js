import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import Mustache from 'mustache';
import httpProxyMiddleware, { responseInterceptor } from 'http-proxy-middleware';
import Prometheus from 'prom-client';
import { createLogger, format, transports } from 'winston';
import cookieParser from 'cookie-parser';
import { tokenXMiddleware } from './tokenx.js';
import { readFileSync } from 'fs';
import require from './esm-require.js';
import { applyNotifikasjonMockMiddleware } from '@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock';

const apiMetricsMiddleware = require('prometheus-api-metrics');
const { createProxyMiddleware } = httpProxyMiddleware;

const {
    PORT = 8080,
    NAIS_APP_IMAGE = '?',
    GIT_COMMIT = '?',
    LOGIN_URL = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver',
    NAIS_CLUSTER_NAME = 'local',
    BACKEND_API_URL = 'http://localhost:8080',
    PROXY_LOG_LEVEL = 'info',
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
                log_events_counter.inc({ level: `${level}` });
                return _log[level](...args);
            };
        },
    }
);

log.info(`Frackend startup: ${JSON.stringify({ NAIS_CLUSTER_NAME, MILJO, GIT_COMMIT })}`);

let BUILD_PATH = path.join(process.cwd(), '../build');
if (NAIS_CLUSTER_NAME === 'local') {
    BUILD_PATH = path.join(process.cwd(), '../public');
}

const indexHtml = Mustache.render(readFileSync(path.join(BUILD_PATH, 'index.html')).toString(), {
    SETTINGS: `
            window.environment = {
                MILJO: '${MILJO}',
                NAIS_APP_IMAGE: '${NAIS_APP_IMAGE}',
                GIT_COMMIT: '${GIT_COMMIT}',
            }
        `,
});

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
        })
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
        (await import('./mock/tiltakApiMock.js')).mock(app);
        (await import('./mock/sykefraværMock.js')).mock(app);
        (await import('./mock/refusjonsStatusMock.js')).mock(app);
        (await import('./mock/presenterteKandidaterMock.js')).mock(app);
        (await import('./mock/storageMock.js')).mock(app);

        const {
            applyNotifikasjonMockMiddleware,
        } = require('@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock');

        // TODO: oppdater mock med nytt skjema ig fjern override her
        const { gql } = require('apollo-server-express');
        const data = readFileSync('../bruker.graphql');
        applyNotifikasjonMockMiddleware(
            { app, path: '/min-side-arbeidsgiver/notifikasjon-bruker-api' },
            {
                typeDefs: gql(data.toString()),
            }
        );
    } else {
        const proxyOptions = {
            logLevel: PROXY_LOG_LEVEL,
            logProvider: (_) => log,
            onError: (err, req, res) => {
                log.error(
                    `${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`
                );
            },
            secure: true,
            xfwd: true,
            changeOrigin: true,
        };
        app.use(
            '/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler',
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-fss:arbeidsgiver:tiltak-proxy',
                    prod: 'prod-fss:arbeidsgiver:tiltak-proxy',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()
                onProxyRes: responseInterceptor(async (responseBuffer, proxyRes) => {
                    try {
                        if (proxyRes.statusCode >= 400) {
                            log.warn(
                                `tiltaksgjennomforing-api/avtaler feilet ${proxyRes.statusCode}: ${proxyRes.statusMessage}`
                            );
                            return JSON.stringify([]);
                        }
                        if (proxyRes.headers['content-type'] === 'application/json') {
                            const data = JSON.parse(responseBuffer.toString('utf8')).map(
                                (elem) => ({
                                    tiltakstype: elem.tiltakstype,
                                })
                            );
                            return JSON.stringify(data);
                        }
                    } catch (error) {
                        log.error(`tiltaksgjennomforing-api/avtaler feilet ${error}`);
                        return JSON.stringify([]);
                    }
                }),
                pathRewrite: {
                    '^/min-side-arbeidsgiver/': '/',
                },
                target: {
                    dev: 'https://tiltak-proxy.dev-fss-pub.nais.io',
                    prod: 'https://tiltak-proxy.prod-fss-pub.nais.io',
                }[MILJO],
            })
        );

        app.use(
            '/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater',
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-gcp:toi:presenterte-kandidater-api',
                    prod: 'prod-gcp:toi:presenterte-kandidater-api',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                pathRewrite: {
                    '^/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern': '/ekstern',
                },
                target: 'http://presenterte-kandidater-api.toi',
            })
        );

        app.use(
            '/min-side-arbeidsgiver/api',
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-gcp:fager:min-side-arbeidsgiver-api',
                    prod: 'prod-gcp:fager:min-side-arbeidsgiver-api',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                pathRewrite: {
                    '^/min-side-arbeidsgiver/api': '/ditt-nav-arbeidsgiver-api/api',
                },
                target: BACKEND_API_URL,
            })
        );

        app.use(
            '/min-side-arbeidsgiver/notifikasjon-bruker-api',
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-gcp:fager:notifikasjon-bruker-api',
                    prod: 'prod-gcp:fager:notifikasjon-bruker-api',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                target: 'http://notifikasjon-bruker-api.fager.svc.cluster.local',
                pathRewrite: {
                    '^/min-side-arbeidsgiver/notifikasjon-bruker-api': '/api/graphql',
                },
            })
        );

        // TODO: fjern denne når vi tenker alle klienter er oppdatert med ny kode
        app.use(
            '/min-side-arbeidsgiver/sykefravaer',
            /* Ingen tokenx her fordi vi går mot deres frackend.
             * Vi har på backlocken å skrive oss over til kafka-versjonen,
             * så da blir vi kvitt dette unntaket.
             */
            createProxyMiddleware({
                ...proxyOptions,
                target: SYKEFRAVAER_DOMAIN,
                pathRewrite: {
                    '^/min-side-arbeidsgiver/sykefravaer': '/sykefravarsstatistikk/api/',
                },
            })
        );

        app.get('/min-side-arbeidsgiver/redirect-til-login', (req, res) => {
            const target = new URL(LOGIN_URL);
            target.searchParams.set('redirect', req.get('referer'));
            res.redirect(target.href);
        });
    }

    app.use('/min-side-arbeidsgiver/', express.static(BUILD_PATH, { index: false }));

    app.get('/min-side-arbeidsgiver/internal/isAlive', (req, res) => res.sendStatus(200));
    app.get('/min-side-arbeidsgiver/internal/isReady', (req, res) => res.sendStatus(200));

    app.get('/min-side-arbeidsgiver/informasjon-om-tilgangsstyring', (req, res) => {
        res.redirect(301, 'https://www.nav.no/arbeidsgiver/tilganger');
    });

    app.get('/min-side-arbeidsgiver/*', (req, res) => {
        res.send(indexHtml);
    });

    if (MILJO === 'dev' || MILJO === 'prod') {
        const gauge = new Prometheus.Gauge({
            name: 'backend_api_gw',
            help: 'Hvorvidt frontend-server naar backend-server. up=1, down=0',
        });
        setInterval(async () => {
            try {
                const res = await fetch(
                    `${BACKEND_API_URL}/ditt-nav-arbeidsgiver-api/internal/actuator/health`
                );
                gauge.set(res.ok ? 1 : 0);
            } catch (error) {
                log.error(`healthcheck error: ${gauge.name}`, error);
                gauge.set(0);
            }
        }, 60 * 1000);
    }

    app.listen(PORT, () => {
        log.info(`Server listening on port ${PORT}`);
    });
};

main()
    .then((_) => log.info('main started'))
    .catch((e) => log.error('main failed', e));
