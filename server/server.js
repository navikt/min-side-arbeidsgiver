import path from 'path';
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
import { createLightship } from 'lightship';

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

log.info(`Frackend startup: ${JSON.stringify({ NAIS_CLUSTER_NAME, MILJO, GIT_COMMIT })}`);

let BUILD_PATH = path.join(process.cwd(), '../build');

const indexHtml = Mustache.render(readFileSync(path.join(BUILD_PATH, 'index.html')).toString(), {
    SETTINGS: `
            window.environment = {
                MILJO: '${MILJO}',
                NAIS_APP_IMAGE: '${NAIS_APP_IMAGE}',
                GIT_COMMIT: '${GIT_COMMIT}',
            }
        `,
});

const grace_time_ms = MILJO === 'local' ? 1_000 : 15_000;
function delay(timeout_ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout_ms);
    });
}

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
        (await import('./mock/userInfoMock.js')).mock(app);
        (await import('./mock/altinnMeldingsboksMock.js')).mock(app);
        (await import('./mock/altinnBeOmTilgangMock.js')).mock(app);
        (await import('./mock/enhetsRegisteretMock.js')).mock(app);
        (await import('./mock/antallArbeidsforholdMock.js')).mock(app);
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
            logger: log,
            on: {
                error: (err, req, res) => {
                    log.error(
                        `${req.method} ${req.path} => [${res.statusCode}:${res.statusText}]: ${err.message}`
                    );
                },
            },
            secure: true,
            xfwd: true,
            changeOrigin: true,
        };
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
                    ...proxyOptions.on,
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

    // could remove these, but lightship mounts at root. see https://github.com/gajus/lightship/issues/53
    app.get('/min-side-arbeidsgiver/internal/isAlive', (req, res) =>
        res.sendStatus(lightship.isServerShuttingDown() ? 500 : 200)
    );
    app.get('/min-side-arbeidsgiver/internal/isReady', (req, res) =>
        res.sendStatus(lightship.isServerReady() ? 200 : 500)
    );

    app.get('/min-side-arbeidsgiver/informasjon-om-tilgangsstyring', (req, res) => {
        res.redirect(301, 'https://www.nav.no/arbeidsgiver/tilganger');
    });

    app.get('/min-side-arbeidsgiver/*', (req, res) => {
        res.send(indexHtml);
    });

    const lightship = await createLightship();
    lightship.queueBlockingTask(delay(grace_time_ms));

    const server = app.listen(PORT, () => {
        log.info(`Server listening on port ${PORT}`);
        lightship.signalReady();
    });

    lightship.registerShutdownHandler(async () => {
        log.info('SIGTERM signal received: closing HTTP server after a short delay');
        await delay(grace_time_ms);

        server.close();
    });
};

main()
    .then((_) => log.info('main started'))
    .catch((e) => log.error('main failed', e));
