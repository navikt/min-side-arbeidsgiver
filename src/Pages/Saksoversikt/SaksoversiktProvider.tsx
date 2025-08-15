import React, {
    createContext,
    FunctionComponent,
    PropsWithChildren,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerContext';
import { useSaker } from './useSaker';
import { SIDE_SIZE } from './Saksoversikt';
import { logAnalyticsEvent } from '../../utils/analytics';
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
import { useSessionStorage } from '../../hooks/useStorage';

export type SaksoversiktTransitions = {
    setFilter: (filter: SaksoversiktFilterState) => void;
    setValgtFilterId: (id: string | undefined) => void;
    setSide: (side: number) => void;
    setSortering: (sortering: SakSortering) => void;
};

export type SaksoversiktState =
    | {
          state: 'loading';
          filter: SaksoversiktFilterState;
          valgtLagretFilterId: string | undefined;
          totaltAntallSaker: number | undefined;
          forrigeSaker: Array<Sak> | null;
          sakstyper: Array<Sakstype> | undefined;
          oppgaveFilterInfo: Array<OppgaveFilterInfo> | undefined;
          startTid: Date;
      }
    | {
          state: 'done';
          filter: SaksoversiktFilterState;
          valgtLagretFilterId: string | undefined;
          saker: Array<Sak>;
          sakstyper: Array<Sakstype>;
          totaltAntallSaker: number;
          oppgaveFilterInfo: Array<OppgaveFilterInfo>;
      }
    | {
          state: 'error';
          filter: SaksoversiktFilterState;
          valgtLagretFilterId: string | undefined;
          sakstyper: Array<Sakstype> | undefined;
          totaltAntallSaker: number | undefined;
          oppgaveFilterInfo: Array<OppgaveFilterInfo> | undefined;
      };

export const ZodSaksoversiktFilterState = z.object({
    side: z.number(),
    tekstsoek: z.string(),
    virksomheter: z.custom<Set<string>>((val) => Set.isSet(val)),
    sortering: z.enum([SakSortering.NyesteFørst, SakSortering.EldsteFørst]),
    sakstyper: z.array(z.string()),
    oppgaveFilter: z.array(OppgaveFilterType),
});

export const ZodSaksoversiktLagretFilter = ZodSaksoversiktFilterState.extend({
    filterId: z.string(),
    navn: z.string(),
});

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

export type SaksoversiktFilterState = z.infer<typeof ZodSaksoversiktFilterState>;
export type SaksoversiktLagretFilter = z.infer<typeof ZodSaksoversiktLagretFilter>;

export type SaksoversiktContext = {
    saksoversiktState: SaksoversiktState;
    transitions: SaksoversiktTransitions;
};

type Action =
    | { action: 'bytt-filter'; filter: SaksoversiktFilterState }
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

    const reduce = (current: SaksoversiktState, action: Action): SaksoversiktState => {
        switch (action.action) {
            case 'bytt-filter':
                if (equalFilter(current.filter, action.filter)) {
                    return current;
                }
                setSessionStorageValue({
                    saksoversiktFilterState: action.filter,
                    valgtLagretFilterId: current.valgtLagretFilterId,
                });
                return {
                    ...current,
                    filter: action.filter,
                };
            case 'sett-valgt-filterid':
                setSessionStorageValue({
                    saksoversiktFilterState: current.filter,
                    valgtLagretFilterId: action.id,
                });
                return {
                    ...current,
                    valgtLagretFilterId: action.id,
                };
            case 'lasting-pågår':
                return {
                    state: 'loading',
                    filter: current.filter,
                    valgtLagretFilterId: current.valgtLagretFilterId,
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
                    valgtLagretFilterId: current.valgtLagretFilterId,
                    sakstyper: current.sakstyper,
                    totaltAntallSaker: current.totaltAntallSaker,
                    oppgaveFilterInfo: current.oppgaveFilterInfo,
                };
            case 'lasting-ferdig':
                const { totaltAntallSaker, saker, oppgaveFilterInfo, sakstyper } = action.resultat;
                return {
                    state: 'done',
                    filter: current.filter,
                    valgtLagretFilterId: current.valgtLagretFilterId,
                    saker: saker,
                    sakstyper: sakstyper,
                    totaltAntallSaker: totaltAntallSaker,
                    oppgaveFilterInfo: oppgaveFilterInfo,
                };
        }
    };

    const transitions: SaksoversiktTransitions = {
        setFilter: (filter: SaksoversiktFilterState) =>
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

    const { saksoversiktFilterState, valgtLagretFilterId, setSessionStorageValue } =
        useFilterStateSessionStorage();

    const [state, dispatch] = useReducer(reduce, {
        state: 'loading',
        filter: saksoversiktFilterState,
        valgtLagretFilterId: valgtLagretFilterId,
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
                totaltAntallVirksomheter: orgs.length
            });
            dispatch({ action: 'lasting-ferdig', resultat: data.saker });
        }
    }, [loading, data]);

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

const FilterStateSessionStorage = z.object({
    saksoversiktFilterState: ZodSaksoversiktFilterState,
    valgtLagretFilterId: z.string().optional(),
});

type FilterStateSessionStorage = z.infer<typeof FilterStateSessionStorage>;

export const defaultFilterState: FilterStateSessionStorage = {
    valgtLagretFilterId: undefined,
    saksoversiktFilterState: {
        side: 1,
        tekstsoek: '',
        virksomheter: Set(),
        sortering: SakSortering.NyesteFørst,
        oppgaveFilter: [],
        sakstyper: [],
    },
};

const useFilterStateSessionStorage = () => {
    const SESSION_STATE_KEY = 'saksoversikt_filter';
    const [sessionStorageValue, setSessionStorageValue] =
        useSessionStorage<FilterStateSessionStorage>(SESSION_STATE_KEY, defaultFilterState);

    // Av en eller annen grunn er det sykt klønete å parse et Set fra sessionStorage. Gjør dette på den enkleste måten
    const parsedFilter = {
        ...sessionStorageValue.saksoversiktFilterState,
        virksomheter: Set(sessionStorageValue.saksoversiktFilterState.virksomheter),
    };

    return {
        ...sessionStorageValue,
        saksoversiktFilterState: parsedFilter,
        setSessionStorageValue,
    };

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

export const equalFilter = (a: SaksoversiktFilterState, b: SaksoversiktFilterState): boolean =>
    a.side === b.side &&
    a.tekstsoek === b.tekstsoek &&
    is(a.virksomheter, b.virksomheter) &&
    a.sortering === b.sortering &&
    equalAsSets(a.sakstyper, b.sakstyper) &&
    equalAsSets(a.oppgaveFilter, b.oppgaveFilter);
