const path = require('path');
const express = require('express');

const server = express();
const sonekrysning = require('./src/api/apiPathConfig.js');


server.use('/ditt-nav-arbeidsgiver', express.static(path.join(__dirname,'build')));

// server.use('/ditt-nav-arbeidsgiver', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
// });

const port = process.env.PORT || 3000;

server.get(
    '/ditt-nav-arbeidsgiver/internal/isAlive',
    (req, res) => res.sendStatus(200)
);
server.get(
    '/ditt-nav-arbeidsgiver/internal/isReady',
    (req, res) => res.sendStatus(200)
);



server.use('/ditt-nav-arbeidsgiver/api', sonekrysning);

server.listen(port, () => {
    console.log('Server listening on port', port);
});

