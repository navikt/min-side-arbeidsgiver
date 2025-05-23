import React, {
    createContext,
    FunctionComponent,
    PropsWithChildren,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerContext';
import { useSessionStateSaksoversikt } from './useOversiktSessionStorage';
import { useSaker } from './useSaker';
import { SIDE_SIZE } from './Saksoversikt';
import { finnBucketForAntall, logAnalyticsEvent } from '../../utils/analytics';
import {
    OppgaveFilterInfo,
    OppgaveFilterType,
    OppgaveTilstand,
    Sak,
    SakerResultat,
    SakSortering,
    Sakstype,
} from '../../api/graphql-types';
import { Set, is } from 'immutable';
import * as Record from '../../utils/Record';
import { z } from 'zod';

export type SaksoversiktTransitions = {
    setFilter: (filter: SaksoversiktFilter) => void;
    setValgtFilterId: (id: string | undefined) => void;
    setSide: (side: number) => void;
    setSortering: (sortering: SakSortering) => void;
};

export type SaksoversiktState =
    | {
          state: 'loading';
          filter: SaksoversiktFilter;
          valgtFilterId: string | undefined;
          totaltAntallSaker: number | undefined;
          forrigeSaker: Array<Sak> | null;
          sakstyper: Array<Sakstype> | undefined;
          oppgaveFilterInfo: Array<OppgaveFilterInfo> | undefined;
          startTid: Date;
      }
    | {
          state: 'done';
          filter: SaksoversiktFilter;
          valgtFilterId: string | undefined;
          saker: Array<Sak>;
          sakstyper: Array<Sakstype>;
          totaltAntallSaker: number;
          oppgaveFilterInfo: Array<OppgaveFilterInfo>;
      }
    | {
          state: 'error';
          filter: SaksoversiktFilter;
          valgtFilterId: string | undefined;
          sakstyper: Array<Sakstype> | undefined;
          totaltAntallSaker: number | undefined;
          oppgaveFilterInfo: Array<OppgaveFilterInfo> | undefined;
      };

export const ZodSaksoversiktFilter = z.preprocess(
    // Preprocess for å håndtere gamle modeller av lagrede filter, som ikke lenger samsvarer med typen
    (val: any) => {
        if (val.oppgaveFilter === undefined) {
            val.oppgaveFilter =
                val.oppgaveTilstand.map((ot: string) => mapOppgaveTilstandTilFilterType(ot)) ?? [];
        }
        val.virksomheter = Set(val.virksomheter);
        return val;
    },
    z.object({
        side: z.number(),
        tekstsoek: z.string(),
        virksomheter: z.custom<Set<string>>((val) => Set.isSet(val)),
        sortering: z
            .enum([SakSortering.NyesteFørst, SakSortering.EldsteFørst])
            .catch(SakSortering.NyesteFørst)
            .default(SakSortering.NyesteFørst),
        sakstyper: z.array(z.string()),
        oppgaveFilter: z.array(OppgaveFilterType),
    })
);

export const mapOppgaveTilstandTilFilterType = (tilstand: string): OppgaveFilterType | null => {
    switch (tilstand) {
        case OppgaveTilstand.Ny:
            return OppgaveFilterType.Values.TILSTAND_NY;
        case OppgaveTilstand.Utfoert:
            return OppgaveFilterType.Values.TILSTAND_UTFOERT;
        case OppgaveTilstand.Utgaatt:
            return OppgaveFilterType.Values.TILSTAND_UTGAATT;
        default:
            return null;
    }
};

export type SaksoversiktFilter = z.infer<typeof ZodSaksoversiktFilter>;

export type SaksoversiktContext = {
    saksoversiktState: SaksoversiktState;
    transitions: SaksoversiktTransitions;
};

type Action =
    | { action: 'bytt-filter'; filter: SaksoversiktFilter }
    | { action: 'sett-valgt-filterid'; id: string | undefined }
    | { action: 'lasting-pågår' }
    | { action: 'lasting-ferdig'; resultat: SakerResultat }
    | { action: 'lasting-feilet' };

export const SaksoversiktContext = createContext<SaksoversiktContext>(undefined!);

export const useSaksoversiktContext = () => {
    const context = useContext(SaksoversiktContext);
    if (context === undefined) {
        throw new Error('SaksoversiktContext må brukes inne i en SaksoversiktProvider');
    }

    return context;
};

export const SaksOversiktProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();

    const orgs = Record.mapToArray(organisasjonsInfo, (_, { organisasjon }) => organisasjon);

    const [{ filter, valgtFilterId }, setSessionStateSaksoversikt] =
        useSessionStateSaksoversikt(orgs);



    const reduce = (current: SaksoversiktState, action: Action): SaksoversiktState => {
        switch (action.action) {
            case 'bytt-filter':
                if (equalFilter(current.filter, action.filter)) {
                    return current;
                }
                setSessionStateSaksoversikt(action.filter, current.valgtFilterId);
                return {
                    ...current,
                    filter: action.filter,
                };
            case 'sett-valgt-filterid':
                return {
                    ...current,
                    valgtFilterId: action.id,
                };
            case 'lasting-pågår':
                return {
                    state: 'loading',
                    filter: current.filter,
                    valgtFilterId: current.valgtFilterId,
                    sakstyper: current.sakstyper,
                    oppgaveFilterInfo: current.oppgaveFilterInfo,
                    startTid: new Date(),
                    totaltAntallSaker: current.totaltAntallSaker,
                    forrigeSaker: finnForrigeSaker(current),
                };
            case 'lasting-feilet':
                return {
                    state: 'error',
                    filter: current.filter,
                    valgtFilterId: current.valgtFilterId,
                    sakstyper: current.sakstyper,
                    totaltAntallSaker: current.totaltAntallSaker,
                    oppgaveFilterInfo: current.oppgaveFilterInfo,
                };
            case 'lasting-ferdig':
                const { totaltAntallSaker, saker, oppgaveFilterInfo, sakstyper } = action.resultat;
                console.log("lastet ferdig");
                console.log(saker)
                console.log(totaltAntallSaker)
                return {
                    state: 'done',
                    filter: current.filter,
                    valgtFilterId: current.valgtFilterId,
                    saker: saker,
                    sakstyper: sakstyper,
                    totaltAntallSaker: totaltAntallSaker,
                    oppgaveFilterInfo: oppgaveFilterInfo,
                };
        }
    };

    const [state, dispatch] = useReducer(reduce, {
        state: 'loading',
        filter: filter,
        valgtFilterId: valgtFilterId,
        forrigeSaker: null,
        totaltAntallSaker: undefined,
        sakstyper: undefined,
        oppgaveFilterInfo: undefined,
        startTid: new Date(),
    });

    const { loading, data } = useSaker(SIDE_SIZE, state.filter);

    useEffect(() => {
        if (loading) {
            dispatch({ action: 'lasting-pågår' });
        } else if (data?.saker?.__typename !== 'SakerResultat') {
            dispatch({ action: 'lasting-feilet' });
        } else {
            logAnalyticsEvent('komponent-lastet', {
                komponent: 'saksoversikt',
                side: state.filter.side,
                tekstsoek: state.filter.tekstsoek.trim() !== '',
                totaltAntallSaker: data.saker.totaltAntallSaker,
                totaltAntallSakstyper: state.sakstyper?.length ?? 0,
                totaltAntallVirksomheter: orgs.length,
                totaltAntallSakerBucket: finnBucketForAntall(data.saker.totaltAntallSaker),
                totaltAntallSakstyperBucket: finnBucketForAntall(state.sakstyper?.length),
                totaltAntallVirksomheterBucket: finnBucketForAntall(orgs.length),
            });
            dispatch({ action: 'lasting-ferdig', resultat: data.saker });
        }
    }, [loading, data]);

    const transitions: SaksoversiktTransitions = {
        setFilter: (filter: SaksoversiktFilter) =>
            dispatch({ action: 'bytt-filter', filter: { ...filter, side: 1 } }),
        setValgtFilterId: (id: string | undefined) =>
            dispatch({ action: 'sett-valgt-filterid', id }),
        setSide: (side: number) =>
            dispatch({ action: 'bytt-filter', filter: { ...state.filter, side } }),
        setSortering: (sortering: SakSortering) =>
            dispatch({
                action: 'bytt-filter',
                filter: { ...state.filter, sortering, side: 1 },
            }),
    };

    return (
        <SaksoversiktContext.Provider
            value={{
                saksoversiktState: state,
                transitions,
            }}
        >
            {props.children}
        </SaksoversiktContext.Provider>
    );
};

const finnForrigeSaker = (state: SaksoversiktState): Array<Sak> | null => {
    switch (state.state) {
        case 'done':
            return state.saker;
        case 'loading':
            return state.forrigeSaker ?? null;
        case 'error':
            return null;
    }
};

export function equalAsSets(a: string[], b: string[]) {
    return a.length === b.length && a.every((aa) => b.includes(aa));
}

export const equalFilter = (a: SaksoversiktFilter, b: SaksoversiktFilter): boolean =>
    a.side === b.side &&
    a.tekstsoek === b.tekstsoek &&
    is(a.virksomheter, b.virksomheter) &&
    a.sortering === b.sortering &&
    equalAsSets(a.sakstyper, b.sakstyper) &&
    equalAsSets(a.oppgaveFilter, b.oppgaveFilter);
