
const path = require('path');
const express = require('express');
const BASE_PATH='/ditt-nav-arbeidsgiver';
const server = express();
const mustacheExpress = require('mustache-express');
const getDecorator = require('./decorator');
const Promise = require('promise');
const sonekrysning = require('./sonekrysningConfig.js');
const veilarbStatusProxyConfig = require('./veilarbStatusProxyConfig');
const tiltakSonekrysningConfig = require('./tiltaksSonekrysningConfig');
const createEnvSettingsFile = require('./envSettings.js');

const buildPath = path.join(__dirname,'../../build');

server.use(`${BASE_PATH}/api`, sonekrysning);
server.use(`${BASE_PATH}/veilarbstepup/status`,veilarbStatusProxyConfig);
server.use(`${BASE_PATH}/tiltaksgjennomforing-api/avtaler`,tiltakSonekrysningConfig);

server.engine('html', mustacheExpress());
server.set('view engine', 'mustache');
server.set('views', buildPath);

createEnvSettingsFile(path.resolve(`${buildPath}/static/js/settings.js`));

server.get(`${BASE_PATH}/redirect-til-login`, (req, res) => {
    const loginUrl = process.env.LOGIN_URL ||
        'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/ditt-nav-arbeidsgiver';
    res.redirect(loginUrl);
});


const renderApp = decoratorFragments =>
    new Promise((resolve, reject) => {
        server.render('index.html', decoratorFragments, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

const startServer = html => {
    console.log("start server");
    server.use(BASE_PATH, express.static(buildPath,{index: false}));

    server.get(
        `${BASE_PATH}/internal/isAlive`,
        (req, res) => res.sendStatus(200)
    );
    server.get(
        `${BASE_PATH}/internal/isReady`,
        (req, res) => res.sendStatus(200)
    );
    server.get(`${BASE_PATH}/*`, (req, res) => {
        res.send(html);
    });
    server.listen(3000, () => {
        console.log('Server listening on port', 3000);
    });
};

getDecorator()
    .then(renderApp, error => console.log('Kunne ikke hente dekoratør ', error))
    .then(startServer, error => console.log('Kunne ikke rendre app ', error));
