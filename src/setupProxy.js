/* Automatically picked up by react-script in development mode. */

const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
    app.get('/min-side-arbeidsgiver/redirect-til-login',
        createProxyMiddleware({
                target: 'http://localhost:8080'
            }
        )
    );
};