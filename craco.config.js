const CracoLessPlugin = require("craco-less");
const { ApolloServer, gql } = require('apollo-server');
const casual = require('casual');
const fs = require('fs');
const {
    BRUKER_API_HOST = 'http://localhost:1337',
} = process.env;

const startApollo = () => {
    const data = fs.readFileSync('./src/api/bruker.graphql');
    const typeDefs = gql(data.toString());
    new ApolloServer({
        typeDefs,
        mocks: {
            Int: () => casual.integer(0, 1000),
            String: () => casual.catch_phrase,
            Instant: () => new Date().toISOString()
        },
    }).listen({
        port: 1337,
        path: '/api/graphql',
    }).then(({ url }) => {
        console.log(`🚀 gql server ready at ${url}`)
    });
}

module.exports = {
    devServer: {
        proxy: {
            '/min-side-arbeidsgiver/api': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/min-side-arbeidsgiver/api' : '/ditt-nav-arbeidsgiver-api/api'}
            },
            '/api/graphql': {
                target: BRUKER_API_HOST,
                changeOrigin: true
            }
        },
        before: (app) => {
            app.get('/min-side-arbeidsgiver/redirect-til-login', (req, res) => {
                const loginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/min-side-arbeidsgiver';
                res.redirect(loginUrl);
            });
            startApollo();
        }
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
