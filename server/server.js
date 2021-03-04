import path from 'path';
import fetch from 'node-fetch';
import express from 'express';
import mustacheExpress from 'mustache-express';
import httpProxyMiddleware from "http-proxy-middleware";
import jsdom from "jsdom";

const {JSDOM} = jsdom;
const {createProxyMiddleware} = httpProxyMiddleware;
const defaultLoginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver';
const defaultDecoratorUrl = 'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&chatbot=true&level=Level4';
const {
    PORT = 3000,
    LOGIN_URL = defaultLoginUrl,
    DECORATOR_EXTERNAL_URL = defaultDecoratorUrl,
    BASE_PATH = '/min-side-arbeidsgiver',
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
        SETTINGS: `<script type="application/javascript">
            window.appSettings = {
                MILJO: '${NAIS_CLUSTER_NAME}',
            }
        </script>`,
    };
}

const app = express();
app.disable("x-powered-by");
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', BUILD_PATH);

app.use(
    base('/api'),
    createProxyMiddleware({
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
app.use(
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
app.use(base('/'), express.static(BUILD_PATH, { index: false }));

app.get(base('/redirect-til-login'), (req, res) => {
    res.redirect(LOGIN_URL);
});
app.get(
    base('/internal/isAlive'),
    (req, res) => res.sendStatus(200)
);
app.get(
    base('/internal/isReady'),
    (req, res) => res.sendStatus(200)
);

const serve = async () => {
    try {
        const fragments = await getDecoratorFragments();
        app.get(base('/*'), (req, res) => {
            res.render('index.html', fragments, (err, html) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    res.send(html);
                }
            });
        });
        app.listen(PORT, () => {
            console.log('Server listening on port ', PORT);
        });
    } catch (error) {
        console.error('Server failed to start ', error);
        process.exit(1);
    }
}

serve().then(/*noop*/);
