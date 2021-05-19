const CracoLessPlugin = require("craco-less");
const {
    BRUKER_API_HOST = 'http://localhost:8081',
} = process.env;

module.exports = {
    devServer: {
        proxy: {
            '/min-side-arbeidsgiver/api': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/min-side-arbeidsgiver/api' : '/ditt-nav-arbeidsgiver-api/api'}
            },
            '/min-side-arbeidsgiver/notifikasjon/': {
                pathRewrite: {'^/min-side-arbeidsgiver/notifikasjon': ''},
                target: BRUKER_API_HOST,
                headers: {
                    host: "ag-notifikasjon-bruker-api.localhost",
                    Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJzdWIiOiIwMDAwMDAwMDAwMCIsImlzcyI6ImxvY2FsaG9zdCJ9."
                }
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
