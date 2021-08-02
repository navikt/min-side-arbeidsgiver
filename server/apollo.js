import fs from 'fs'
import require from "./esm-require.js";
import casual from 'casual';
const {MockList, ApolloServer, gql} = require("apollo-server");

const roundDate = (millis) => {
    const date = new Date();
    return new Date(Math.floor(date.getTime() / millis) * millis)
}

const startApolloMock = () => {
    const data = fs.readFileSync('./bruker.graphql');
    const typeDefs = gql(data.toString());
    const Notifikasjon = () => ({
        __typename: casual.boolean ? 'Beskjed' : 'Oppgave',
        merkelapp: casual.random_element([
            'Tilskudd',
            'Rekrutering',
            'Refusjon',
            'Sykemeldt'
        ]),
        text: casual.short_description,
        lenke: `#${casual.word}`,
    })
    new ApolloServer({
        typeDefs,
        mocks: {
            Query: () =>({
                notifikasjoner: () => new MockList(200, Notifikasjon),
            }),
            Int: () => casual.integer(0, 1000),
            String: () => casual.string,
            ISO8601DateTime: () => roundDate(5000).toISOString(),
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