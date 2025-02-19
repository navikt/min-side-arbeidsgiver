import {
    Kalenderavtale,
    Notifikasjon,
    QuerySakerArgs,
    Sak,
    SakSortering,
} from '../../api/graphql-types';
import { graphql, HttpResponse } from 'msw';
import { executeAndValidate, oppgaveTilstandInfo } from './helpers';
import { Merkelapp } from './alleMerkelapper';

export const hentSakerResolver = (saker: Sak[]) =>
    graphql.query(
        'hentSaker',
        async ({ query, variables }: { query: string; variables: QuerySakerArgs }) => {
            const sakerFiltrert = saker.filter(
                ({ merkelapp }) => variables.sakstyper?.includes(merkelapp) ?? true
            );
            if (variables.sortering === SakSortering.EldsteFørst) {
                sakerFiltrert.reverse();
            }

            // create a map of merkelapp to number of saker
            const sakstyper = Array.from(
                saker.reduce((acc, { merkelapp }) => {
                    acc.set(merkelapp, (acc.get(merkelapp) ?? 0) + 1);
                    return acc;
                }, new Map<string, number>())
            ).map(([navn, antall]) => ({ navn, antall }));

            const { errors, data } = await executeAndValidate({
                query,
                variables,
                rootValue: {
                    saker: {
                        saker: sakerFiltrert.length > 0 ? sakerFiltrert : saker,
                        sakstyper: sakstyper,
                        feilAltinn: false,
                        totaltAntallSaker: saker.length,
                        oppgaveTilstandInfo: oppgaveTilstandInfo(),
                    },
                },
            });

            return HttpResponse.json({ errors, data });
        }
    );

export const hentKalenderavtalerResolver = (kalenderavtaler: Kalenderavtale[]) =>
    graphql.query('HentKalenderavtaler', async ({ query, variables }) => {
        const { errors, data } = await executeAndValidate({
            query,
            variables,
            rootValue: {
                kommendeKalenderavtaler: {
                    avtaler: kalenderavtaler.filter(
                        (avtale) =>
                            avtale.avtaletilstand != 'AVHOLDT' && avtale.avtaletilstand != 'AVLYST'
                    ),
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
                sakstyper: [...new Set(sakstyper)].map((navn) => ({ navn })),
            },
        });

        return HttpResponse.json({ errors, data });
    });

export const hentSakByIdResolver = (saker: Sak[]) =>
    graphql.query('HENT_SAK_ID', async () => {
        const sak = saker[0];
        return HttpResponse.json({
            data: {
                sakById: {
                    sak,
                    feilAltinn: false,
                },
            },
        });
    });
