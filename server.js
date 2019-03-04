const path = require('path');
const express = require('express');
const BASE_PATH='/ditt-nav-arbeidsgiver';
const server = express();
const sonekrysning = require('./src/api/apiPathConfig.js');


server.use(BASE_PATH, express.static(path.join(__dirname,'build')));


const port = process.env.PORT || 3000;

server.get(
    `${BASE_PATH}/internal/isAlive`,
    (req, res) => res.sendStatus(200)
);
server.get(
    `${BASE_PATH}/internal/isReady`,
    (req, res) => res.sendStatus(200)
);

server.use(`${BASE_PATH}/api`, sonekrysning);

server.listen(port, () => {
    console.log('Server listening on port', port);
});