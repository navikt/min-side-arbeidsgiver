import { http, HttpResponse } from 'msw';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { subDays } from 'date-fns';
import { setupServer } from 'msw/node';
import { virksomhet } from '../../../mocks/brukerApi/helpers';
import NotifikasjonPanel from './NotifikasjonPanel';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '../../Pages';
import { Notifikasjon, OppgaveTilstand } from '../../../api/graphql-types';
import {
    hentNotifikasjonerResolver,
    hentNotifikasjonerSistLest, setNotifikasjonerSistLest,
} from '../../../mocks/brukerApi/resolvers';
import { fakerNB_NO as faker } from '@faker-js/faker';

describe('Uleste Notifikasjoner', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('to notifikasjoner, en skal være lest', async () => {
        server.use(
            hentNotifikasjonerSistLest(toDagerIFortiden),
            hentNotifikasjonerResolver(notifikasjoner)
        );

        render(
            <ApolloProvider
                client={createApolloClient(`${__BASE_PATH__}/api/notifikasjon-bruker-api`)}
            >
                <NotifikasjonPanel />
            </ApolloProvider>
        );

        const antallUlesteElement = await screen.findByTestId('antallUleste');
        expect(antallUlesteElement.textContent).toBe('1');
    });

    it('leser fra localStorage dersom remote returnerer null', async () => {
        server.use(
            hentNotifikasjonerSistLest(null),
            hentNotifikasjonerResolver(notifikasjoner),
            setNotifikasjonerSistLest()
        );

        localStorage.setItem('sist_lest', JSON.stringify(toDagerIFortiden));
        render(
            <ApolloProvider
                client={createApolloClient(`${__BASE_PATH__}/api/notifikasjon-bruker-api`)}
            >
                <NotifikasjonPanel />
            </ApolloProvider>
        );

        const antallUlesteElement = await screen.findByTestId('antallUleste');
        expect(antallUlesteElement.textContent).toBe('1');
    });
});

const server = setupServer(
    http.get(`${__BASE_PATH__}/api/altinn-tilgangssoknad`, () => HttpResponse.json([]))
);
const nå = new Date();
const toDagerIFortiden = subDays(nå, 2)

const notifikasjoner: Notifikasjon[] = [
    {
        __typename: 'Oppgave',
        id: faker.string.uuid(),
        tekst: 'tekst',
        tilstand: OppgaveTilstand.Ny,
        frist: null,
        opprettetTidspunkt: nå.toISOString(),
        paaminnelseTidspunkt: nå.toISOString(),
        utfoertTidspunkt: nå.toISOString(),
        utgaattTidspunkt: nå.toISOString(),
        sorteringTidspunkt: nå.toISOString(),
        brukerKlikk: {
            __typename: 'BrukerKlikk',
            id: faker.string.uuid(),
            klikketPaa: false,
        },

        lenke: 'lenke',
        merkelapp: 'merkelapp',

        sak: {
            __typename: 'SakMetadata',
            tittel: 'sakTittel',
            tilleggsinformasjon: 'tilleggsinformasjon',
        },
        virksomhet: virksomhet(),
    },
    {
        __typename: 'Beskjed',
        id: faker.string.uuid(),
        tekst: 'tekst',
        opprettetTidspunkt: toDagerIFortiden.toISOString(),
        sorteringTidspunkt: toDagerIFortiden.toISOString(),
        brukerKlikk: {
            __typename: 'BrukerKlikk',
            id: faker.string.uuid(),
            klikketPaa: false,
        },

        lenke: 'lenke',
        merkelapp: 'merkelapp',

        sak: {
            __typename: 'SakMetadata',
            tittel: 'sakTittel',
            tilleggsinformasjon: 'tilleggsinformasjon',
        },
        virksomhet: virksomhet(),
    },
];
