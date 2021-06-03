import fs from 'fs'
import require from "./esm-require.js";
import casual from 'casual';
const {MockList, ApolloServer, gql} = require("apollo-server");

const startApolloMock = () => {
    const data = fs.readFileSync('./bruker.graphql');
    const typeDefs = gql(data.toString());
    new ApolloServer({
        typeDefs,
        mocks: {
            Query: () =>({
                notifikasjoner: () => new MockList(200),
            }),
            Int: () => casual.integer(0, 1000),
            String: () => casual.string,
            ISO8601DateTime: () => new Date().toISOString(),
            Beskjed: () => ({
                merkelapp: casual.word,
                text: casual.short_description,
                lenke: `#${casual.word}`
            }),
            Virksomhet: () => ({
                navn: casual.catch_phrase,
            }),
        },
    }).listen({
        port: 8081,
        path: '/api/graphql',
    }).then(({ url }) => {
        console.log(`🚀 gql server ready at ${url}`)
    });
}

startApolloMock()