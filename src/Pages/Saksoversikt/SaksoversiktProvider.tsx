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
    OppgaveFilterInfo, OppgaveFilterType,
    Sak,
    SakerResultat,
    SakSortering,
    Sakstype,
} from '../../api/graphql-types';
import { Set, is } from 'immutable';
import * as Record from '../../utils/Record';
import { z } from 'zod';

export type SaksoversiktTransitions = {
    setFilter: (filter: Filter) => void;
    setValgtFilterId: (id: string | undefined) => void;
    setSide: (side: number) => void;
    setSortering: (sortering: SakSortering) => void;
};

export type SaksoversiktState =
    | {
          state: 'loading';
          filter: Filter;
          valgtFilterId: string | undefined;
          sider: number | undefined;
          totaltAntallSaker: number | undefined;
          forrigeSaker: Array<Sak> | null;
          sakstyper: Array<Sakstype> | undefined;
          oppgaveFilterInfo: Array<OppgaveFilterInfo> | undefined;
          startTid: Date;
      }
    | {
          state: 'done';
          filter: Filter;
          valgtFilterId: string | undefined;
          sider: number;
          saker: Array<Sak>;
          sakstyper: Array<Sakstype>;
          totaltAntallSaker: number;
          oppgaveFilterInfo: Array<OppgaveFilterInfo>;
      }
    | {
          state: 'error';
          filter: Filter;
          valgtFilterId: string | undefined;
          sider: number | undefined;
          sakstyper: Array<Sakstype> | undefined;
          totaltAntallSaker: number | undefined;
          oppgaveFilterInfo: Array<OppgaveFilterInfo> | undefined;
      };

export const ZodFilter = z.object({
    side: z.number(),
    tekstsoek: z.string(),
    virksomheter: z.custom<Set<string>>((val) => Set.isSet(val)),
    sortering: z.enum([SakSortering.NyesteFørst, SakSortering.EldsteFørst]),
    sakstyper: z.array(z.string()),
    oppgaveFilter: z.array(OppgaveFilterType)
});

export type Filter = z.infer<typeof ZodFilter>;

export type SaksoversiktContext = {
    saksoversiktState: SaksoversiktState;
    transitions: SaksoversiktTransitions;
};

type Action =
    | { action: 'bytt-filter'; filter: Filter }
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
                    sider: current.sider,
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
                    sider: current.sider,
                    sakstyper: current.sakstyper,
                    totaltAntallSaker: current.totaltAntallSaker,
                    oppgaveFilterInfo: current.oppgaveFilterInfo,
                };
            case 'lasting-ferdig':
                const { totaltAntallSaker, saker, oppgaveFilterInfo, sakstyper } = action.resultat;
                const sider = Math.ceil(totaltAntallSaker / SIDE_SIZE);
                return {
                    state: 'done',
                    filter: current.filter,
                    valgtFilterId: current.valgtFilterId,
                    sider,
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
        sider: undefined,
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
        setFilter: (filter: Filter) => dispatch({ action: 'bytt-filter', filter }),
        setValgtFilterId: (id: string | undefined) =>
            dispatch({ action: 'sett-valgt-filterid', id }),
        setSide: (side: number) =>
            dispatch({ action: 'bytt-filter', filter: { ...state.filter, side } }),
        setSortering: (sortering: SakSortering) =>
            dispatch({
                action: 'bytt-filter',
                filter: { ...state.filter, sortering },
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

export const equalFilter = (a: Filter, b: Filter): boolean =>
    a.side === b.side &&
    a.tekstsoek === b.tekstsoek &&
    is(a.virksomheter, b.virksomheter) &&
    a.sortering === b.sortering &&
    equalAsSets(a.sakstyper, b.sakstyper) &&
    equalAsSets(a.oppgaveFilter, b.oppgaveFilter);
