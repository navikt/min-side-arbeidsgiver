const CracoLessPlugin = require("craco-less");

module.exports = {
    devServer: {
        proxy: {
            '/ditt-nav-arbeidsgiver/api': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/ditt-nav-arbeidsgiver/api' : '/ditt-nav-arbeidsgiver-api/api'}
            }
        },
        before: (app) => {
            app.get('/ditt-nav-arbeidsgiver/redirect-til-login', (req, res) => {
                const loginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/ditt-nav-arbeidsgiver';
                res.redirect(loginUrl);
            });
        }
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
