import path from 'path';
import express from 'express';
import Mustache from 'mustache';
import httpProxyMiddleware, {
    debugProxyErrorsPlugin,
    errorResponsePlugin,
    proxyEventsPlugin,
    responseInterceptor,
} from 'http-proxy-middleware';
import { createHttpTerminator } from 'http-terminator';
import Prometheus from 'prom-client';
import { createLogger, format, transports } from 'winston';
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
    LOGIN_URL = '',
    NAIS_CLUSTER_NAME = 'local',
    MILJO = 'local',
} = process.env;

const log_events_counter = new Prometheus.Counter({
    name: 'logback_events_total',
    help: 'Antall log events fordelt på level',
    labelNames: ['level'],
});
const proxy_events_counter = new Prometheus.Counter({
    name: 'proxy_events_total',
    help: 'Antall proxy events',
    labelNames: ['target', 'proxystatus', 'status', 'errcode'],
});

const maskFormat = format((info) => ({
    ...info,
    message: info.message.replace(/\d{9,}/g, (match) => '*'.repeat(match.length)),
}));

// proxy calls to log.<level> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get
const log = new Proxy(
    createLogger({
        format: maskFormat(),
        transports: [
            new transports.Console({
                timestamp: true,
                format: format.combine(format.splat(), format.json()),
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

const cookieScraperPlugin = (proxyServer, options) => {
    proxyServer.on('proxyReq', (proxyReq, req, res, options) => {
        if (proxyReq.getHeader('cookie')) {
            proxyReq.removeHeader('cookie');
        }
    });
};
// copy with mods from http-proxy-middleware https://github.com/chimurai/http-proxy-middleware/blob/master/src/plugins/default/logger-plugin.ts
const loggerPlugin = (proxyServer, options) => {
    proxyServer.on('error', (err, req, res, target) => {
        const hostname = req?.headers?.host;
        // target is undefined when websocket errors
        const errReference = 'https://nodejs.org/api/errors.html#errors_common_system_errors'; // link to Node Common Systems Errors page
        proxy_events_counter.inc({
            target: target.host,
            proxystatus: null,
            status: res.statusCode,
            errcode: err.code || 'unknown',
        });
        const level =
            /HPE_INVALID/.test(err.code) ||
            ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT'].includes(err.code)
                ? 'warn'
                : 'error';
        log.log(
            level,
            '[HPM] Error occurred while proxying request %s to %s [%s] (%s)',
            `${hostname}${req?.host}${req?.path}`,
            `${target?.href}`,
            err.code || err,
            errReference
        );
    });

    proxyServer.on('proxyRes', (proxyRes, req, res) => {
        const originalUrl = req.originalUrl ?? `${req.baseUrl || ''}${req.url}`;
        const pathUpToSearch = proxyRes.req.path.replace(/\?.*$/, '');
        const exchange = `[HPM] ${req.method} ${originalUrl} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${pathUpToSearch} [${proxyRes.statusCode}]`;
        proxy_events_counter.inc({
            target: proxyRes.req.host,
            proxystatus: proxyRes.statusCode,
            status: res.statusCode,
            errcode: null,
        });
        log.info(exchange);
    });

    /**
     * When client opens WebSocket connection
     */
    proxyServer.on('open', (socket) => {
        log.info('[HPM] Client connected: %o', socket.address());
    });

    /**
     * When client closes WebSocket connection
     */
    proxyServer.on('close', (req, proxySocket, proxyHead) => {
        log.info('[HPM] Client disconnected: %o', proxySocket.address());
    });
};

log.info(`Frackend startup: ${JSON.stringify({ NAIS_CLUSTER_NAME, MILJO, GIT_COMMIT })}`);

let BUILD_PATH = path.join(process.cwd(), '../build');
if (MILJO === 'local') {
    BUILD_PATH = path.join(process.cwd(), '../');
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

const proxyOptions = {
    logger: log,
    secure: true,
    xfwd: true,
    changeOrigin: true,
    ejectPlugins: true,
    plugins: [
        cookieScraperPlugin,
        debugProxyErrorsPlugin,
        errorResponsePlugin,
        loggerPlugin,
        proxyEventsPlugin,
    ],
};

const main = async () => {
    let appReady = false;
    const app = express();
    app.disable('x-powered-by');
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

    if (MILJO === 'dev') {
        (await import('./mock/enhetsRegisteretMock.js')).mock(app);
    }

    if (MILJO === 'local' || MILJO === 'demo') {
        (await import('./mock/innloggetMock.js')).mock(app);
        (await import('./mock/pamMock.js')).mock(app);
        (await import('./mock/userInfoMock.js')).mock(app);
        (await import('./mock/varslingStatusMock.js')).mock(app);
        (await import('./mock/altinnBeOmTilgangMock.js')).mock(app);
        (await import('./mock/enhetsRegisteretMock.js')).mock(app);
        (await import('./mock/antallArbeidsforholdMock.js')).mock(app);
        (await import('./mock/tiltakApiMock.js')).mock(app);
        (await import('./mock/sykefraværMock.js')).mock(app);
        (await import('./mock/presenterteKandidaterMock.js')).mock(app);
        (await import('./mock/storageMock.js')).mock(app);
        (await import('./mock/kontaktinfoApiMock.js')).mock(app);

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
                mocks: {
                    KalenderavtalerResultat: () => ({
                        avtaler: [
                            {
                                tekst: 'Dialogmøte Mikke',
                                startTidspunkt: '2021-02-04T15:15:00',
                                sluttTidspunkt: null,
                                lokasjon: {
                                    adresse: 'Thorvald Meyers gate 2B',
                                    postnummer: '0473',
                                    poststed: 'Oslo',
                                },
                                tilstand: 'ARBEIDSGIVER_VIL_AVLYSE',
                                digitalt: false,
                            },
                            {
                                tekst: 'Dialogmøte Minni',
                                startTidspunkt: '2021-02-04T15:15:00',
                                sluttTidspunkt: null,
                                tilstand: 'ARBEIDSGIVER_HAR_GODTATT',
                                digitalt: true,
                                fysisk: null,
                            },
                            {
                                tekst: 'Dialogmøte Dolly',
                                startTidspunkt: '2021-02-04T15:15:00',
                                sluttTidspunkt: '2021-02-04T16:15:00',
                                tilstand: 'ARBEIDSGIVER_VIL_ENDRE_TID_ELLER_STED',
                                digitalt: false,
                                fysisk: {
                                    adresse: 'Thorvald Meyers gate 2B',
                                    postnummer: '0473',
                                    poststed: 'Oslo',
                                },
                            },
                            {
                                tekst: 'Dialogmøte Donald',
                                startTidspunkt: '2021-02-04T15:15:00',
                                sluttTidspunkt: null,
                                tilstand: 'VENTER_SVAR_FRA_ARBEIDSGIVER',
                                fysisk: null,
                                digitalt: false,
                            },
                            {
                                tekst: 'Dialogmøte Langbein',
                                startTidspunkt: '2021-02-04T15:15:00',
                                sluttTidspunkt: '2021-02-04T16:15:00',
                                tilstand: 'AVLYST',
                                fysisk: null,
                            },
                        ],
                    }),
                },
            }
        );
        app.use(
            '/min-side-arbeidsgiver/artikler',
            createProxyMiddleware({
                ...proxyOptions,
                pathRewrite: { '^/': '' },
                target: 'https://storage.googleapis.com/fager-prod-msa-artikler-public',
            })
        );
    } else {
        app.use(
            '/min-side-arbeidsgiver/tiltaksgjennomforing-api',
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
                on: {
                    proxyRes: responseInterceptor(async (responseBuffer, proxyRes) => {
                        try {
                            if (proxyRes.statusCode >= 400) {
                                log.warn(
                                    `tiltaksgjennomforing-api feilet ${proxyRes.statusCode}: ${proxyRes.statusMessage}`
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
                            log.error(`tiltaksgjennomforing-api feilet ${error}`);
                            return JSON.stringify([]);
                        }
                    }),
                },
                target: {
                    dev: 'https://tiltak-proxy.dev-fss-pub.nais.io/tiltaksgjennomforing-api',
                    prod: 'https://tiltak-proxy.prod-fss-pub.nais.io/tiltaksgjennomforing-api',
                }[MILJO],
            })
        );

        app.use(
            '/min-side-arbeidsgiver/presenterte-kandidater-api',
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-gcp:toi:presenterte-kandidater-api',
                    prod: 'prod-gcp:toi:presenterte-kandidater-api',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                target: 'http://presenterte-kandidater-api.toi',
            })
        );

        app.use(
            '/min-side-arbeidsgiver/arbeidsgiver-arbeidsforhold-api',
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-fss:arbeidsforhold:aareg-innsyn-arbeidsgiver-api',
                    prod: 'prod-fss:arbeidsforhold:aareg-innsyn-arbeidsgiver-api',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                target: {
                    dev: 'https://aareg-innsyn-arbeidsgiver-api.dev-fss-pub.nais.io/arbeidsgiver-arbeidsforhold-api',
                    prod: 'https://aareg-innsyn-arbeidsgiver-api.prod-fss-pub.nais.io/arbeidsgiver-arbeidsforhold-api',
                }[MILJO],
            })
        );

        app.use(
            '/min-side-arbeidsgiver/stillingsregistrering-api',
            tokenXMiddleware({
                log: log,
                audience: {
                    dev: 'dev-gcp:teampam:pam-stillingsregistrering-api',
                    prod: 'prod-gcp:teampam:pam-stillingsregistrering-api',
                }[MILJO],
            }),
            createProxyMiddleware({
                ...proxyOptions,
                target: {
                    dev: 'https://arbeidsplassen.intern.dev.nav.no/stillingsregistrering-api',
                    prod: 'https://arbeidsplassen.nav.no/stillingsregistrering-api',
                }[MILJO],
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
                target: 'http://min-side-arbeidsgiver-api.fager.svc.cluster.local/ditt-nav-arbeidsgiver-api/api',
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
                pathRewrite: { '^/': '' },
                target: 'http://notifikasjon-bruker-api.fager.svc.cluster.local/api/graphql',
            })
        );

        app.use(
            '/min-side-arbeidsgiver/artikler',
            createProxyMiddleware({
                ...proxyOptions,
                pathRewrite: { '^/': '' },
                target: 'https://storage.googleapis.com/fager-prod-msa-artikler-public',
            })
        );

        app.get('/min-side-arbeidsgiver/redirect-til-login', (req, res) => {
            const target = new URL(LOGIN_URL);
            target.searchParams.set('redirect', req.get('referer'));
            res.redirect(target.href);
        });
    }

    app.use(
        '/min-side-arbeidsgiver/',
        express.static(BUILD_PATH, {
            index: false,
            etag: false,
            maxAge: '1h',
        })
    );

    app.get('/min-side-arbeidsgiver/internal/isAlive', (req, res) => res.sendStatus(200));
    app.get('/min-side-arbeidsgiver/internal/isReady', (req, res) =>
        res.sendStatus(appReady ? 200 : 500)
    );

    app.get('/min-side-arbeidsgiver/informasjon-om-tilgangsstyring', (req, res) => {
        res.redirect(301, 'https://www.nav.no/arbeidsgiver/tilganger');
    });

    app.get('/min-side-arbeidsgiver/*', (req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Etag', GIT_COMMIT);
        res.send(indexHtml);
    });

    const server = app.listen(PORT, () => {
        log.info(`Server listening on port ${PORT}`);
        setTimeout(() => {
            appReady = true;
        }, 5_000);
    });

    const terminator = createHttpTerminator({
        server,
        gracefulTerminationTimeout: 30_000, // defaults: terminator=5s, k8s=30s
    });

    process.on('SIGTERM', () => {
        log.info('SIGTERM signal received: closing HTTP server');
        terminator.terminate();
    });
};

main()
    .then((_) => log.info('main started'))
    .catch((e) => log.error('main failed', e));
