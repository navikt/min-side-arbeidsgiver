const path = require('path');
const express = require('express');
const BASE_PATH='/ditt-nav-arbeidsgiver';
const server = express();
const sonekrysning = require('./sonekrysningConfig.js');
const createEnvSettingsFile = require('./envSettings.js');

const buildPath = path.join(__dirname,'../../build');

createEnvSettingsFile(path.resolve(`${buildPath}/static/js/settings.js`));

server.get(`${BASE_PATH}/redirect-til-login`, (req, res) => {
    const loginUrl = process.env.LOGIN_URL ||
        'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/ditt-nav-arbeidsgiver';
    res.redirect(loginUrl);
});

server.use(BASE_PATH, express.static(buildPath));

server.use(`${BASE_PATH}/api`, sonekrysning);

server.use(BASE_PATH, (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
});

const port = process.env.PORT || 3000;

server.get(
    `${BASE_PATH}/internal/isAlive`,
    (req, res) => res.sendStatus(200)
);
server.get(
    `${BASE_PATH}/internal/isReady`,
    (req, res) => res.sendStatus(200)
);

server.listen(port, () => {
    console.log('Server listening on port', port);
});