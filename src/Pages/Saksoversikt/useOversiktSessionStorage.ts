// Keep oversiktsfilter up to date with query parameters.
// Store copy of oversikts-filter in sessionStorage

import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useStorage';
import { equalAsSets, Filter } from './useOversiktStateTransitions';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { OppgaveTilstand, SakSortering } from '../../api/graphql-types';
import { Set } from 'immutable';
import { Organisasjon } from '../../altinn/organisasjon';
import { Login } from '@navikt/ds-icons';
import amplitude from 'amplitude-js';

const SESSION_STORAGE_KEY = 'saksoversiktfilter';

type SessionStateSaksoversikt = {
    route: '/saksoversikt';
    side: number;
    tekstsoek: string;
    virksomhetsnumre: string[] | 'ALLEBEDRIFTER';
    sortering: SakSortering;
    bedrift: string | undefined;
    sakstyper: string[];
    oppgaveTilstand: OppgaveTilstand[];
    valgtFilterId: string | undefined;
};
type SessionStateForside = {
    route: '/';
    bedrift: string | undefined;
};

type SessionState = SessionStateSaksoversikt | SessionStateForside;

const filterToSessionState = (
    filter: Filter,
    valgtFilterId: string | undefined
): SessionStateSaksoversikt => ({
    route: '/saksoversikt',
    bedrift: undefined,
    side: filter.side,
    tekstsoek: filter.tekstsoek,
    sortering: filter.sortering,
    virksomhetsnumre: filter.virksomheter.toArray(),
    sakstyper: filter.sakstyper,
    oppgaveTilstand: filter.oppgaveTilstand,
    valgtFilterId,
});

const equalVirksomhetsnumre = (
    a: SessionStateSaksoversikt,
    b: SessionStateSaksoversikt
): boolean => {
    const virksomheterA = a.virksomhetsnumre;
    const virksomheterB = b.virksomhetsnumre;
    if (virksomheterA === 'ALLEBEDRIFTER' && virksomheterB === 'ALLEBEDRIFTER') {
        return true;
    } else if (Array.isArray(virksomheterA) && Array.isArray(virksomheterB)) {
        return (
            virksomheterA.length === virksomheterB.length &&
            virksomheterA.every((aVirksomhet) =>
                virksomheterB.some((bVirksomhet) => aVirksomhet === bVirksomhet)
            )
        );
    } else {
        return false;
    }
};

export const equalSessionState = (a: SessionState, b: SessionState): boolean => {
    if (a.route === '/' && b.route === '/') {
        return a.bedrift === b.bedrift;
    } else if (a.route === '/saksoversikt' && b.route === '/saksoversikt') {
        return (
            a.side === b.side &&
            a.tekstsoek === b.tekstsoek &&
            a.bedrift === b.bedrift &&
            a.sortering === b.sortering &&
            a.valgtFilterId === b.valgtFilterId &&
            equalVirksomhetsnumre(a, b) &&
            equalAsSets(a.sakstyper, b.sakstyper) &&
            equalAsSets(a.oppgaveTilstand, b.oppgaveTilstand)
        );
    } else {
        return false;
    }
};

export const useSessionStateForside = (): void => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const bedrift = valgtOrganisasjon?.organisasjon?.OrganizationNumber;

    useEffect(() => {
        const sessionState: SessionStateForside = {
            route: '/',
            bedrift,
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
    }, [bedrift]);
};

export type UseSessionState = [
    {
        filter: Filter;
        valgtFilterId: string | undefined;
    },
    (filter: Filter, valgtFilterId: string | undefined) => void,
];

const defaultSessionState: SessionStateSaksoversikt = {
    route: '/saksoversikt',
    side: 1,
    tekstsoek: '',
    virksomhetsnumre: 'ALLEBEDRIFTER',
    sortering: SakSortering.Oppdatert,
    bedrift: undefined,
    sakstyper: [],
    oppgaveTilstand: [],
    valgtFilterId: undefined,
};

export const useSessionState = (alleVirksomheter: Organisasjon[]): UseSessionState => {
    const [sessionState, setSessionState] = useSessionStorage(
        SESSION_STORAGE_KEY,
        defaultSessionState
    );

    const [params, setParams] = useSearchParams();

    useEffect(() => {
        if (params === undefined) return;

        let queryParametre: string[] = [];

        // @ts-ignore
        for (const key of params.keys()) {
            queryParametre.push(key);
        }
        if (queryParametre.length === 0) return;

        setParams({}, { replace: true });
        //console.log('Saksoversikt_query_parametre', { queryParametre }); TODO: Logge til amplitude
    }, []);

    const update = (newFilter: Filter, newValgtFilterId: string | undefined) => {
        const newSessionState = filterToSessionState(newFilter, newValgtFilterId);
        if (!equalSessionState(sessionState, newSessionState)) {
            setSessionState(newSessionState);
        }
    };

    const filter = useMemo(() => {
        return {
            route: '/saksoversikt',
            side: sessionState.side,
            tekstsoek: sessionState.tekstsoek,
            virksomheter:
                sessionState.virksomhetsnumre === 'ALLEBEDRIFTER'
                    ? Set<string>()
                    : Set(
                          sessionState.virksomhetsnumre.flatMap((orgnr) => {
                              const org = alleVirksomheter.find(
                                  (org) => org.OrganizationNumber === orgnr
                              );
                              return org !== undefined ? [orgnr] : [];
                          })
                      ),
            sortering: sessionState.sortering,
            sakstyper: sessionState.sakstyper,
            oppgaveTilstand: sessionState.oppgaveTilstand,
        };
    }, [
        sessionState.side,
        sessionState.tekstsoek,
        sessionState.virksomhetsnumre === 'ALLEBEDRIFTER'
            ? 'ALLEBEDRIFTER'
            : sessionState.virksomhetsnumre.join(','),
        sessionState.sortering,
        sessionState.sakstyper.join(','),
        sessionState.oppgaveTilstand.join(','),
    ]);

    return [{ filter, valgtFilterId: sessionState.valgtFilterId }, update];
};

// Clear sessionStorage with oversikts-filter.
export const useOversiktsfilterClearing = () => {
    const [, , deleteFromSession] = useSessionStorage<SessionState | undefined>(
        SESSION_STORAGE_KEY,
        undefined
    );
    useEffect(() => {
        deleteFromSession();
    }, []);
};

export const useRestoreSessionFromStorage = () => {
    const [storedSession] = useSessionStorage<SessionState | undefined>(
        SESSION_STORAGE_KEY,
        undefined
    );
    const location = useLocation();
    const navigate = useNavigate();

    return () => {
        if (storedSession?.route === '/') {
            navigate({ pathname: '/' }, { replace: true });
        } else {
            navigate({ pathname: '/saksoversikt' }, { replace: true });
        }
    };
};
