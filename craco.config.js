const CracoLessPlugin = require("craco-less");
const {ProvidePlugin} = require("webpack");
const {
    BRUKER_API_HOST = 'http://localhost:8081',
} = process.env;


module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => ({
            ...webpackConfig,
            ...{
                plugins: [
                    ...webpackConfig.plugins,
                    new ProvidePlugin({
                        Buffer: [require.resolve("buffer/"), "Buffer"],
                        process: require.resolve("process/browser")
                    })
                ],
                resolve: {
                    ...webpackConfig.resolve,
                    fallback: {
                        "buffer": require.resolve("buffer/"),
                        "crypto": require.resolve("crypto-browserify"),
                        "process": require.resolve("process/browser"),
                        "stream": require.resolve("stream-browserify"),
                    }
                }
            }
        }),
    },
    devServer: {
        proxy: {
            '/min-side-arbeidsgiver/notifikasjon/': {
                pathRewrite: {'^/min-side-arbeidsgiver/notifikasjon': ''},
                target: BRUKER_API_HOST,
                headers: {
                    host: "ag-notifikasjon-bruker-api.localhost",
                },
                onProxyReq: (proxyReq, req, _res) => {
                    const token = req.cookies['selvbetjening-idtoken']
                    proxyReq.setHeader('Authorization', `Bearer ${token}`);
                }
            },
        },
        setupMiddlewares: (middlewares, {app}) => {
            const fetch = require('node-fetch');
            const cookieParser = require('cookie-parser');
            app.use(cookieParser());

            app.get('/min-side-arbeidsgiver/api/innlogget', (req, res) => {
                const token = req.cookies.hasOwnProperty('selvbetjening-idtoken')
                if (token) {
                    console.log("innlogget? ja (cookie selvbetjening-idtoken eksisterer)")
                    res.status(200).send()
                } else {
                    console.log("innlogget? nei (cookie selvbetjening-idtoken mangler)")
                    res.status(401).send()
                }
            });
            app.get('/min-side-arbeidsgiver/redirect-til-login', async (req, res) => {
                const response = await fetch('https://fakedings.dev-gcp.nais.io/fake/custom', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    },
                    body: `sub=00112233445&aud=${encodeURIComponent("bruker-api")}&acr=Level4`
                });
                const token = await response.text()
                res.cookie("selvbetjening-idtoken", token)
                console.log(`login: setter selvbetjening-idtoken til ${token}`)
                res.redirect("http://localhost:3000/min-side-arbeidsgiver");
            });

            require('./server/mock/pamMock').mock(app);
            require('./server/mock/syfoMock').mock(app);
            require('./server/mock/altinnMock').mock(app);
            require('./server/mock/altinnMeldingsboksMock').mock(app);
            require('./server/mock/unleashMock').mock(app);
            require('./server/mock/altinnBeOmTilgangMock').mock(app);
            require('./server/mock/enhetsRegisteretMock').mock(app);
            require('./server/mock/antallArbeidsforholdMock').mock(app);
            require('./server/mock/tiltakApiMock').mock(app);
            require('./server/mock/sykefraværMock').mock(app);
            return middlewares
        }
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
