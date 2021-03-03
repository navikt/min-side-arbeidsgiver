import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import mustacheExpress from 'mustache-express';
import {createProxyMiddleware} from "http-proxy-middleware";
import {JSDOM} from "jsdom";

const defaultLoginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver';
const defaultDecoratorUrl = 'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&chatbot=true&level=Level4';
const {
    PORT = 3000,
    LOGIN_URL = defaultLoginUrl,
    DECORATOR_EXTERNAL_URL = defaultDecoratorUrl,
    BASE_PATH = '/min-side-arbeidsgiver',
    MOCK = false,
    NAIS_CLUSTER_NAME = 'local',
    API_GATEWAY = 'http://localhost:8080',
    APIGW_HEADER,
} = process.env;

const decoratorUrl = NAIS_CLUSTER_NAME === 'prod-sbs' ? defaultDecoratorUrl : DECORATOR_EXTERNAL_URL;
const BUILD_PATH = path.join(process.cwd(), '../build');
const base = (part) => `${BASE_PATH}${part}`;
const getDecoratorFragments = async () => {
    const response = await fetch(decoratorUrl);
    const body = await response.text();
    const {document} = new JSDOM(body).window;
    return {
        HEADER: document.getElementById('header-withmenu').innerHTML,
        FOOTER: document.getElementById('footer-withmenu').innerHTML,
        STYLES: document.getElementById('styles').innerHTML,
        SCRIPTS: document.getElementById('scripts').innerHTML,
        APP_SETTINGS: `window.appSettings = {
            MILJO: '${NAIS_CLUSTER_NAME}',
        }`,
    };
}

const server = express();
server.engine('html', mustacheExpress());
server.set('view engine', 'mustache');
server.set('views', BUILD_PATH);

server.use(
    base('/api'),
    createProxyMiddleware({
        changeOrigin: true,
        pathRewrite: {
            '^/min-side-arbeidsgiver/api': '/ditt-nav-arbeidsgiver-api/api',
        },
        secure: true,
        xfwd: true,
        target: API_GATEWAY,
        ...(APIGW_HEADER ? {'x-nav-apiKey': APIGW_HEADER} : {})
    })
);
server.use(
    base('/syforest/arbeidsgiver/sykmeldte'),
    createProxyMiddleware({
        changeOrigin: true,
        target: NAIS_CLUSTER_NAME === "prod-sbs" ? "https://tjenester.nav.no" : "https://tjenester-q1.nav.no",
        pathRewrite: {
            '^/min-side-arbeidsgiver': '',
        },
        secure: true,
        xfwd: true
    })
);
server.use(BASE_PATH, express.static(BUILD_PATH, {...(MOCK ? {} : {index: false})}));

server.get(base('/redirect-til-login'), (req, res) => {
    res.redirect(LOGIN_URL);
});
server.get(
    base('/internal/isAlive'),
    (req, res) => res.sendStatus(200)
);
server.get(
    base('/internal/isReady'),
    (req, res) => res.sendStatus(200)
);

if (MOCK) {
    console.error("mounted mock middleware. local dev only!");
    server.get(base('/*'), (req, res) => {
        res.sendFile(path.resolve(BUILD_PATH, 'index.html'));
    });

} else {
    getDecoratorFragments()
        .then(decoratorFragments => {
            console.log("mounted html render middleware");
            server.get(base('/*'), (req, res) => {
                res.render('index.html', decoratorFragments, (err, html) => {
                    if (err) {
                        console.error(err);
                        res.sendStatus(500);
                    } else {
                        res.send(html);
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Kunne ikke hente decoratør ', error);
            process.exit(1);
        });
}

server.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});
