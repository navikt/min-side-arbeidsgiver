import {
    InputMaybe,
    Kalenderavtale,
    Notifikasjon, OppgaveFilterType,
    OppgaveTilstand,
    QuerySakerArgs,
    Sak,
    SakSortering,
} from '../../api/graphql-types';
import { graphql, HttpResponse } from 'msw';
import { executeAndValidate, oppgaveFilterInfo } from './helpers';
import { Merkelapp } from './alleMerkelapper';
import { mapOppgaveTilstandTilFilterType } from '../../Pages/Saksoversikt/SaksoversiktProvider';


export const hentSakerResolver = (saker: Sak[]) =>
    graphql.query(
        'hentSaker',
        async ({ query, variables }: { query: string; variables: QuerySakerArgs }) => {
            let sakerFiltrert = applyFilters(saker, variables);

            if (variables.sortering === SakSortering.EldsteFørst) {
                sakerFiltrert.reverse();
            }

            // create a map of merkelapp to number of saker
            const sakstyper = Array.from(
                saker.filter(s => harFilterType(s, variables.oppgaveFilter)).reduce((acc, { merkelapp }) => {
                    acc.set(merkelapp, (acc.get(merkelapp) ?? 0) + 1);
                    return acc;
                }, new Map<string, number>())
            ).map(([navn, antall]) => ({ navn, antall }));

            const { errors, data } = await executeAndValidate({
                query,
                variables,
                rootValue: {
                    saker: {
                        saker: sakerFiltrert,
                        sakstyper: sakstyper,
                        feilAltinn: false,
                        totaltAntallSaker: saker.length,
                        oppgaveTilstandInfo: oppgaveFilterInfo(sakerFiltrert),
                        oppgaveFilterInfo: oppgaveFilterInfo(sakerFiltrert),
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

export const hentNotifikasjonerResolver  = (notifikasjoner: Notifikasjon[]) =>
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

function applyFilters(saker: Sak[], filter: QuerySakerArgs) {
    return saker.filter(
        (sak) =>
            erSakstype(sak, filter.sakstyper) &&
            harFilterType(sak, filter.oppgaveFilter)
    );
}

function erSakstype(sak: Sak, sakstyper: InputMaybe<string[]> | undefined){
    return sakstyper?.includes(sak.merkelapp) ?? true
}

function harFilterType(sak: Sak, oppgaveFilter?: InputMaybe<string[]>) {
    if (oppgaveFilter === null || oppgaveFilter === undefined || oppgaveFilter.length === 0) {
        return true;
    }

    if (oppgaveFilter.includes(OppgaveFilterType.Values.TILSTAND_NY_MED_PAAMINNELSE_UTLOEST)) {
        return sak.tidslinje.filter(t => t.__typename === 'OppgaveTidslinjeElement' && t.tilstand === OppgaveTilstand.Ny && t.paaminnelseTidspunkt !== null && t.paaminnelseTidspunkt !== undefined).length > 0;
    }
    return sak.tidslinje.some(
        (te) =>
            te.__typename === 'OppgaveTidslinjeElement' && oppgaveFilter!.includes(mapOppgaveTilstandTilFilterType(te.tilstand)!)
    );
}
