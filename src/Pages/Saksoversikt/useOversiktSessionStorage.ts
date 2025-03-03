// Store copy of oversikts-filter in sessionStorage

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useStorage';
import { equalAsSets, Filter } from './SaksoversiktProvider';
import { SakSortering } from '../../api/graphql-types';
import { Set } from 'immutable';
import amplitude from '../../utils/amplitude';
import { z } from 'zod';
import { Organisasjon } from '../OrganisasjonerOgTilgangerContext';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';

const SESSION_STORAGE_KEY = 'saksoversiktfilter';

type SessionStateSaksoversikt = {
    route: '/saksoversikt';
    side: number;
    tekstsoek: string;
    virksomhetsnumre: string[] | 'ALLEBEDRIFTER';
    sortering: SakSortering;
    sakstyper: string[];
    oppgaveFilter: string[];
    valgtFilterId?: string;
};
type SessionStateForside = {
    route: '/';
};

type SessionState = SessionStateSaksoversikt | SessionStateForside;

//TODO: fjerne denne?
// const filterToSessionState = (
//     filter: Filter,
//     valgtFilterId: string | undefined
// ): SessionStateSaksoversikt => ({
//     route: '/saksoversikt',
//     side: filter.side,
//     tekstsoek: filter.tekstsoek,
//     sortering: filter.sortering,
//     virksomhetsnumre: filter.virksomheter.toArray(),
//     sakstyper: filter.sakstyper,
//     oppgaveFilter: filter.oppgaveFilter,
//     valgtFilterId,
// });

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
            equalAsSets(a.oppgaveFilter, b.oppgaveFilter)
        );
    } else {
        return false;
    }
};

export const useSessionStateForside = (): void => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const [_, setSessionState] = useSessionStorage(SESSION_STORAGE_KEY, { route: '/' });
    const bedrift = valgtOrganisasjon.organisasjon.orgnr;

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
    // (filter: Filter, valgtFilterId: string | undefined) => void,
];

const defaultSessionState: SessionStateSaksoversikt = {
    route: '/saksoversikt',
    side: 1,
    tekstsoek: '',
    virksomhetsnumre: 'ALLEBEDRIFTER',
    sortering: SakSortering.NyesteFørst,
    sakstyper: [],
    oppgaveFilter: [],
    valgtFilterId: undefined,
};

const FilterFromSessionState = z.object({
    route: z.literal('/saksoversikt'),
    side: z.number(),
    tekstsoek: z.string(),
    virksomhetsnumre: z.union([z.array(z.string()), z.literal('ALLEBEDRIFTER')]),
    sortering: z.nativeEnum(SakSortering),
    sakstyper: z.array(z.string()),
    oppgaveFilter: z.array(z.string()),
    valgtFilterId: z.string().optional(),
});

export const useSessionStateSaksoversikt = (alleVirksomheter: Organisasjon[]): UseSessionState => {
    const [sessionStorage, setSessionStorage] = useSessionStorage<SessionState>(
        SESSION_STORAGE_KEY,
        defaultSessionState
    );

    //TODO: change this somehow?
    const [sessionStateSaksoversikt, setSessionStateSaksoversikt] = useState<SessionStateSaksoversikt>(() => {
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
        setSessionStorage(sessionStateSaksoversikt);
    }, [sessionStateSaksoversikt]);

    const [params, setParams] = useSearchParams();

    useEffect(() => {
        if (params.size === 0) return;

        setParams((prevParams) => {
            amplitude.logEvent('komponent-lastet', {
                komponent: 'saksoversiktSessionStorage',
                queryParametere: [...prevParams.keys()],
            });
            return {};
        });
    }, []);

    // //TODO: fjerne denne?
    // const update = (newFilter: Filter, newValgtFilterId: string | undefined) => {
    //     const newSessionState = filterToSessionState(newFilter, newValgtFilterId);
    //     if (!equalSessionState(sessionStateSaksoversikt, newSessionState)) {
    //         setSessionStateSaksoversikt(newSessionState);
    //     }
    // };

    const filter = useMemo(() => {
        return {
            route: '/saksoversikt',
            side: sessionStateSaksoversikt.side,
            tekstsoek: sessionStateSaksoversikt.tekstsoek,
            virksomheter:
                sessionStateSaksoversikt.virksomhetsnumre === 'ALLEBEDRIFTER'
                    ? Set<string>()
                    : Set(
                          sessionStateSaksoversikt.virksomhetsnumre.flatMap((orgnr) => {
                              const org = alleVirksomheter.find((org) => org.orgnr === orgnr);
                              return org !== undefined ? [orgnr] : [];
                          })
                      ),
            sortering: sessionStateSaksoversikt.sortering,
            sakstyper: sessionStateSaksoversikt.sakstyper,
            oppgaveFilter: sessionStateSaksoversikt.oppgaveFilter,
        };
    }, [
        sessionStateSaksoversikt.side,
        sessionStateSaksoversikt.tekstsoek,
        sessionStateSaksoversikt.virksomhetsnumre === 'ALLEBEDRIFTER'
            ? 'ALLEBEDRIFTER'
            : sessionStateSaksoversikt.virksomhetsnumre.join(','),
        sessionStateSaksoversikt.sortering,
        sessionStateSaksoversikt.sakstyper.join(','),
        sessionStateSaksoversikt.oppgaveFilter
    ]);

    return [{ filter, valgtFilterId: sessionStateSaksoversikt.valgtFilterId }];
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
