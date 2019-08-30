const CracoLessPlugin = require("craco-less");

module.exports = {
    devServer: {
        proxy: {
            '/min-side-arbeidsgiver/api': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/min-side-arbeidsgiver/api' : '/ditt-nav-arbeidsgiver-api/api'}
            }
        },
        before: (app) => {
            app.get('/min-side-arbeidsgiver/redirect-til-login', (req, res) => {
                const loginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver';
                res.redirect(loginUrl);
            });
        }
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
