import { useEffect, useReducer } from 'react';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { SIDE_SIZE } from './Saksoversikt'
import { useSessionState } from './useOversiktSessionStorage';
import {equalFilter, Filter} from './Filter';

export type State = {
    state: 'loading';
    filter: Filter;
    sider: number | undefined;
    forrigeSaker: Array<GQL.Sak> | null;
    startTid: Date;
} | {
    state: 'done';
    filter: Filter;
    sider: number;
    saker: Array<GQL.Sak>;
    totaltAntallSaker: number;
} | {
    state: 'error';
    filter: Filter;
    sider: number | undefined;
}

type Action =
    | { action: 'bytt-filter', filter: Filter }
    | { action: 'lasting-pågår' }
    | { action: 'lasting-ferdig', resultat: GQL.SakerResultat }
    | { action: 'lasting-feilet' }

export const useOversiktStateTransitions = () => {
    const [sessionState, setSessionState] = useSessionState()

    const reduce = (current: State, action: Action): State => {
        switch (action.action) {
            case 'bytt-filter':
                if (equalFilter(action.filter, current.filter)) {
                    return current
                } else {
                    return {
                        state: 'loading',
                        filter: action.filter,
                        sider: undefined,
                        startTid: new Date(),
                        forrigeSaker: finnForrigeSaker(current),
                    }
                }
            case 'lasting-pågår':
                return {
                    state: 'loading',
                    filter: current.filter,
                    sider: current.sider,
                    startTid: new Date(),
                    forrigeSaker: finnForrigeSaker(current),
                }
            case 'lasting-feilet':
                return {
                    state: 'error',
                    filter: current.filter,
                    sider: current.sider,
                }
            case 'lasting-ferdig':
                const {totaltAntallSaker, saker} = action.resultat
                const sider = Math.ceil(totaltAntallSaker / SIDE_SIZE)
                if (totaltAntallSaker > 0 && saker.length === 0) {
                    // på et eller annet vis er det saker (totaltAntallSaker > 0), men
                    // vi mottok ingen. Kan det være fordi vi er forbi siste side? Prøv
                    // å gå til siste side.
                    return {
                        state: 'loading',
                        filter: { ... current.filter, side: Math.max(1, sider - 1)},
                        sider,
                        startTid: new Date(),
                        forrigeSaker: null,
                    }
                } else {
                    return {
                        state: 'done',
                        filter: current.filter,
                        sider,
                        saker: action.resultat.saker,
                        totaltAntallSaker: action.resultat.totaltAntallSaker,
                    }
                }
        }
    }

    const [state, dispatch] = useReducer(reduce, {
        state: 'loading',
        filter: sessionState,
        forrigeSaker: null,
        sider: undefined,
        startTid: new Date(),
    })

    useEffect(() => {
        setSessionState(state.filter)
    }, [state.filter])

    return {
        state,
        byttFilter: (filter: Filter) => dispatch({action: 'bytt-filter', filter}),
        lastingPågår: () => dispatch({action: 'lasting-pågår'}),
        lastingFerdig: (resultat: GQL.SakerResultat) => dispatch({action: 'lasting-ferdig', resultat}),
        lastingFeilet: () => dispatch({action: 'lasting-feilet'}),
    }
}

const finnForrigeSaker = (state: State): Array<GQL.Sak> | null => {
    switch (state.state) {
        case 'done':
            return state.saker
        case 'loading':
            return state.forrigeSaker ?? null
        case 'error':
            return null
    }
}
