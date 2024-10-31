import { Kalenderavtale, Notifikasjon, Sak } from '../../api/graphql-types';
import { graphql, HttpResponse } from 'msw';
import { executeAndValidate, oppgaveTilstandInfo } from './helpers';
import { alleMerkelapper, Merkelapp } from './alleMerkelapper';
import { fakerNB_NO as faker } from '@faker-js/faker';
import { alleNotifikasjoner } from './alleNotifikasjoner';

export const hentSakerResolver = (saker: Sak[]) =>
    graphql.query('hentSaker', async ({ query, variables }) => {
        const sakerFiltrert = saker.filter(
            ({ merkelapp }) => variables.sakstyper?.includes(merkelapp) ?? true
        );
        const { errors, data } = await executeAndValidate({
            query,
            variables,
            rootValue: {
                saker: {
                    saker: sakerFiltrert.length > 0 ? sakerFiltrert : saker,
                    sakstyper: saker.map(({ merkelapp }) => ({
                        navn: merkelapp,
                        antall: saker.filter((sak) => sak.merkelapp === merkelapp).length,
                    })),
                    feilAltinn: false,
                    totaltAntallSaker: saker.length,
                    oppgaveTilstandInfo: oppgaveTilstandInfo(),
                },
            },
        });

        return HttpResponse.json({ errors, data });
    });

export const hentKalenderavtalerResolver = (kalenderavtaler: Kalenderavtale[]) =>
    graphql.query('HentKalenderavtaler', async ({ query, variables }) => {
        const { errors, data } = await executeAndValidate({
            query,
            variables,
            rootValue: {
                kommendeKalenderavtaler: {
                    avtaler: kalenderavtaler,
                },
            },
        });

        return HttpResponse.json({ errors, data });
    });

export const hentNotifikasjonerResolver = (notifikasjoner: Notifikasjon[]) =>
    graphql.query('hentNotifikasjoner', async ({ query, variables }) => {
        const { errors, data } = await executeAndValidate({
            query,
            variables,
            rootValue: {
                notifikasjoner: {
                    feilAltinn: false,
                    feilDigiSyfo: false,
                    notifikasjoner,
                },
            },
        });

        return HttpResponse.json({ errors, data });
    });

export const sakstyperResolver = (sakstyper: Merkelapp[]) =>
    graphql.query('Sakstyper', async ({ query, variables }) => {
        const { errors, data } = await executeAndValidate({
            query,
            variables,
            rootValue: {
                sakstyper: sakstyper.map((navn) => ({ navn })),
            },
        });

        return HttpResponse.json({ errors, data });
    });
