// Store copy of oversikts-filter in sessionStorage

import { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useStorage';
import { equalAsSets, Filter } from './useOversiktStateTransitions';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { OppgaveTilstand, SakSortering } from '../../api/graphql-types';
import { Set } from 'immutable';
import { Organisasjon } from '../../altinn/organisasjon';
import amplitude from '../../utils/amplitude';
import { z, ZodError } from 'zod';

const SESSION_STORAGE_KEY = 'saksoversiktfilter';

type SessionStateSaksoversikt = {
    route: '/saksoversikt';
    side: number;
    tekstsoek: string;
    virksomhetsnumre: string[] | 'ALLEBEDRIFTER';
    sortering: SakSortering;
    sakstyper: string[];
    oppgaveTilstand: OppgaveTilstand[];
    valgtFilterId?: string;
};
type SessionStateForside = {
    route: '/';
};

type SessionState = SessionStateSaksoversikt | SessionStateForside;

const filterToSessionState = (
    filter: Filter,
    valgtFilterId: string | undefined
): SessionStateSaksoversikt => ({
    route: '/saksoversikt',
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
        return true;
    } else if (a.route === '/saksoversikt' && b.route === '/saksoversikt') {
        return (
            a.side === b.side &&
            a.tekstsoek === b.tekstsoek &&
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
    const [_, setSessionState] = useSessionStorage(SESSION_STORAGE_KEY, { route: '/' });
    const bedrift = valgtOrganisasjon?.organisasjon?.OrganizationNumber;

    useEffect(() => {
        const sessionState: SessionStateForside = {
            route: '/',
        };
        setSessionState(sessionState);
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
    sakstyper: [],
    oppgaveTilstand: [],
    valgtFilterId: undefined,
};

const FilterFromSessionState = z.object({
    route: z.literal('/saksoversikt'),
    side: z.number(),
    tekstsoek: z.string(),
    virksomhetsnumre: z.union([z.array(z.string()), z.literal('ALLEBEDRIFTER')]),
    sortering: z.nativeEnum(SakSortering),
    sakstyper: z.array(z.string()),
    oppgaveTilstand: z.array(z.nativeEnum(OppgaveTilstand)),
    valgtFilterId: z.string().optional(),
});

export const useSessionStateOversikt = (alleVirksomheter: Organisasjon[]): UseSessionState => {
    const [sessionStorage, setSessionStorage] = useSessionStorage<SessionState>(
        SESSION_STORAGE_KEY,
        defaultSessionState
    );

    const [sessionState, setSessionState] = useState<SessionStateSaksoversikt>(() => {
        if (sessionStorage.route === '/saksoversikt') {
            try {
                return FilterFromSessionState.parse(sessionStorage);
            } catch (e) {
                console.error('#MSA: Parse av filter fra SessionStorage feilet', e);
                return defaultSessionState;
            }
        } else {
            return defaultSessionState;
        }
    });

    useEffect(() => {
        setSessionStorage(sessionState);
    }, [sessionState]);

    const [params, setParams] = useSearchParams();

    useEffect(() => {
        if (params.size === 0) return;

        setParams((existing) => {
            amplitude.logEvent('komponent-lastet', {
                komponent: 'saksoversiktSessionStorage',
                queryParametere: [...existing.keys()],
            });
            return {};
        });
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
