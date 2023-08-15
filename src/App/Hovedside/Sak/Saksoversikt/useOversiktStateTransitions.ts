import { useEffect, useReducer } from 'react';
import { SIDE_SIZE } from './Saksoversikt';
import { useSessionState } from './useOversiktSessionStorage';
import { useSaker } from '../useSaker';
import amplitude from '../../../../utils/amplitude';
import {
    OppgaveTilstand,
    OppgaveTilstandInfo,
    Sak,
    SakerResultat,
    SakSortering,
    Sakstype,
} from '../../../../api/graphql-types';
import Immutable, { Set } from 'immutable';
import { Organisasjon } from '../../../../altinn/organisasjon';

export type Filter = {
    side: number,
    tekstsoek: string,
    virksomheter: Set<string>,
    sortering: SakSortering,
    sakstyper: string[],
    oppgaveTilstand: OppgaveTilstand[],
}

export type State = {
    state: 'loading';
    filter: Filter;
    valgtFilterId: string | undefined;
    sider: number | undefined;
    totaltAntallSaker: number | undefined;
    forrigeSaker: Array<Sak> | null;
    sakstyper: Array<Sakstype> | undefined;
    oppgaveTilstandInfo: Array<OppgaveTilstandInfo> | undefined;
    startTid: Date;
} | {
    state: 'done';
    filter: Filter;
    valgtFilterId: string | undefined;
    sider: number;
    saker: Array<Sak>;
    sakstyper: Array<Sakstype>;
    totaltAntallSaker: number;
    oppgaveTilstandInfo: Array<OppgaveTilstandInfo>;
} | {
    state: 'error';
    filter: Filter;
    valgtFilterId: string | undefined;
    sider: number | undefined;
    sakstyper: Array<Sakstype> | undefined;
    totaltAntallSaker: number | undefined;
    oppgaveTilstandInfo: Array<OppgaveTilstandInfo> | undefined;
}

type Action =
    | { action: 'bytt-filter', filter: Filter }
    | { action: 'sett-valgt-filterid', id: string | undefined }
    | { action: 'lasting-pågår' }
    | { action: 'lasting-ferdig', resultat: SakerResultat }
    | { action: 'lasting-feilet' }


export const useOversiktStateTransitions = (alleVirksomheter: Organisasjon[]) => {
    const [sessionState, setSessionState] = useSessionState(alleVirksomheter)

    const [state, dispatch] = useReducer(reduce, {
        state: 'loading',
        filter: sessionState.filter,
        valgtFilterId: sessionState.valgtFilterId,
        forrigeSaker: null,
        sider: undefined,
        totaltAntallSaker: undefined,
        sakstyper: undefined,
        oppgaveTilstandInfo: undefined,
        startTid: new Date(),
    });

    const { loading, data } = useSaker(SIDE_SIZE, state.filter);

    useEffect(() => {
        setSessionState(state.filter, state.valgtFilterId)
    }, [state.filter, state.valgtFilterId])

    useEffect(() => {
        if (loading) {
            dispatch({ action: 'lasting-pågår' });
        } else if (data?.saker?.__typename !== 'SakerResultat') {
            dispatch({ action: 'lasting-feilet' });
        } else {
            amplitude.logEvent('komponent-lastet', {
                komponent: 'saksoversikt',
                side: state.filter.side,
                tekstsoek: state.filter.tekstsoek.trim() !== '',
                totaltAntallSaker: data.saker.totaltAntallSaker,
            });
            dispatch({ action: 'lasting-ferdig', resultat: data.saker });
        }
    }, [loading, data]);

    return {
        state,
        byttFilter: (filter: Filter) => dispatch({ action: 'bytt-filter', filter }),
        setValgtFilterId: (id: string | undefined) => dispatch({ action: 'sett-valgt-filterid', id }),
    };
};

const reduce = (current: State, action: Action): State => {
    switch (action.action) {
        case 'bytt-filter':
            if (equalFilter(current.filter, action.filter)) {
                return current;
            }
            return {
                ...current,
                filter: action.filter,
            };
        case 'sett-valgt-filterid':
            return {
                ...current,
                valgtFilterId: action.id,
            }
        case 'lasting-pågår':
            return {
                state: 'loading',
                filter: current.filter,
                valgtFilterId: current.valgtFilterId,
                sider: current.sider,
                sakstyper: current.sakstyper,
                oppgaveTilstandInfo: current.oppgaveTilstandInfo,
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
                totaltAntallSaker: current.totaltAntallSaker,
                sakstyper: current.sakstyper,
                oppgaveTilstandInfo: current.oppgaveTilstandInfo,
            };
        case 'lasting-ferdig':
            const { totaltAntallSaker, saker } = action.resultat;
            const sider = Math.ceil(totaltAntallSaker / SIDE_SIZE);
            if (totaltAntallSaker > 0 && saker.length === 0) {
                // på et eller annet vis er det saker (totaltAntallSaker > 0), men
                // vi mottok ingen. Kan det være fordi vi er forbi siste side? Prøv
                // å gå til siste side.
                return {
                    state: 'loading',
                    filter: { ...current.filter, side: Math.max(1, sider - 1) },
                    valgtFilterId: current.valgtFilterId,
                    sider,
                    totaltAntallSaker,
                    startTid: new Date(),
                    forrigeSaker: null,
                    sakstyper: current.sakstyper,
                    oppgaveTilstandInfo: current.oppgaveTilstandInfo,
                };
            } else {
                return {
                    state: 'done',
                    filter: current.filter,
                    valgtFilterId: current.valgtFilterId,
                    sider,
                    saker: action.resultat.saker,
                    sakstyper: action.resultat.sakstyper,
                    totaltAntallSaker: action.resultat.totaltAntallSaker,
                    oppgaveTilstandInfo: action.resultat.oppgaveTilstandInfo,
                };
            }
    }
};

const finnForrigeSaker = (state: State): Array<Sak> | null => {
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
    return a.length === b.length && a.every(aa => b.includes(aa));
}

export const equalFilter = (a: Filter, b: Filter): boolean =>
    a.side === b.side &&
    a.tekstsoek === b.tekstsoek &&
    Immutable.is(a.virksomheter, b.virksomheter) &&
    a.sortering === b.sortering &&
    equalAsSets(a.sakstyper, b.sakstyper) &&
    equalAsSets(a.oppgaveTilstand, b.oppgaveTilstand);
