const {MockList} = require("apollo-server");
const startApolloMock = () => {
    const { ApolloServer, gql } = require('apollo-server');
    const casual = require('casual');
    const fs = require('fs');

    const data = fs.readFileSync('./src/api/bruker.graphql');
    const typeDefs = gql(data.toString());
    new ApolloServer({
        typeDefs,
        mocks: {
            Query: () =>({
                notifikasjoner: () => new MockList(200),
            }),
            Int: () => casual.integer(0, 1000),
            String: () => casual.catch_phrase,
            ISO8601DateTime: () => new Date().toISOString()
        },
    }).listen({
        port: 8081,
        path: '/api/graphql',
    }).then(({ url }) => {
        console.log(`🚀 gql server ready at ${url}`)
    });
}

startApolloMock()