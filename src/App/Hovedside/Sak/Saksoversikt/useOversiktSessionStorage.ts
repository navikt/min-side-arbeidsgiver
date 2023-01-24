// Keep oversiktsfilter up to date with query parameters.
// Store copy of oversikts-filter in sessionStorage

import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSessionStorage } from '../../../hooks/useStorage';
import { Filter } from './useOversiktStateTransitions';
import { Organisasjon } from '../Saksfilter/Virksomhetsmeny/Virksomhetsmeny';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

const SESSION_STORAGE_KEY = 'saksoversiktfilter'

type SessionStateSaksoversikt = {
    route: "/saksoversikt",
    side: number,
    tekstsoek: string,
    virksomhetsnumre: string[],
    sortering: GQL.SakSortering,
    bedrift: string | undefined,
}
type SessionStateForside = {
    route: "/",
    bedrift: string | undefined,
}

type SessionState = SessionStateSaksoversikt | SessionStateForside

const filterToSessionState = (filter: Filter): SessionStateSaksoversikt => ({
    route: '/saksoversikt',
    bedrift: new URLSearchParams(window.location.search).get("bedrift") ?? undefined,
    side: filter.side,
    tekstsoek: filter.tekstsoek,
    sortering: filter.sortering,
    virksomhetsnumre: filter.virksomheter.map(virksomhet => virksomhet.OrganizationNumber),
});

const equalVirksomhetsnumre = (a: SessionStateSaksoversikt, b: SessionStateSaksoversikt): boolean => {
    return a.virksomhetsnumre.length === b.virksomhetsnumre.length &&
        a.virksomhetsnumre.every(virksomhetsnummer => b.virksomhetsnumre.includes(virksomhetsnummer));
};

export const equalSessionState = (a: SessionState, b: SessionState): boolean => {
    if (a.route === '/' && b.route === '/') {
        return a.bedrift === b.bedrift;
    } else if (a.route === '/saksoversikt' && b.route === '/saksoversikt') {
        return a.side === b.side &&
            a.tekstsoek === b.tekstsoek &&
            a.bedrift === b.bedrift &&
            a.sortering === b.sortering &&
            equalVirksomhetsnumre(a, b);
    } else {
        return false;
    }
}

export const useSessionStateForside = (): void => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext)
    const bedrift = valgtOrganisasjon?.organisasjon?.OrganizationNumber

    useEffect(() => {
        const sessionState: SessionStateForside = {
            route: '/',
            bedrift,
        }
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
    }, [bedrift])
}

export const useSessionState = (alleVirksomheter: Organisasjon[]): [Filter, (filter: Filter) => void] => {
    const [sessionState, setSessionState] = useState<SessionStateSaksoversikt>(() =>
        extractSearchParameters(window.location.search)
    )

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const newSessionState = extractSearchParameters(location.search)
        if (!equalSessionState(sessionState, newSessionState)) {
            setSessionState(newSessionState)
        }
    }, [location.search])

    useEffect(() => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
    }, [sessionState])

    const update = (newFilter: Filter) => {
        const newSessionState = filterToSessionState(newFilter)
        if (!equalSessionState(sessionState, newSessionState)) {
            const search = updateSearchParameters(location.search, newSessionState)
            if (search !== location.search) {
                navigate({search}, {replace: true});
            }
            setSessionState(newSessionState)
        }
    }

    const filter = useMemo(() => {
        return {
            route: '/saksoversikt',
            side: sessionState.side,
            tekstsoek: sessionState.tekstsoek,
            virksomheter: sessionState.virksomhetsnumre.flatMap(orgnr => {
                const org = alleVirksomheter.find(org => org.OrganizationNumber === orgnr)
                return org !== undefined ? [org] : [];
            }),
            sortering: sessionState.sortering,
        }
    }, [sessionState.side, sessionState.tekstsoek, sessionState.virksomhetsnumre.join(","), sessionState.sortering])

    return [filter, update]
}

const extractSearchParameters = (searchString: string): SessionStateSaksoversikt => {
    const search = new URLSearchParams(searchString)
    const sortering = (search.get("sortering") ?? GQL.SakSortering.Oppdatert) as GQL.SakSortering
    const bedrift = search.get("bedrift") ?? undefined;
    return {
        route: '/saksoversikt',
        bedrift,
        virksomhetsnumre: search.get("virksomhetsnumre")?.split(",") ?? (bedrift === undefined ? [] : [bedrift]),
        tekstsoek: search.get("tekstsoek") ?? '',
        side: Number.parseInt(search.get("side") ?? '1'),
        sortering: Object.values(GQL.SakSortering).includes(sortering) ? sortering : GQL.SakSortering.Oppdatert
    }
}

const updateSearchParameters = (current: string, sessionState: SessionStateSaksoversikt): string => {
    const query = new URLSearchParams(current)

    if (sessionState.tekstsoek.length > 0) {
        query.set("tekstsoek", sessionState.tekstsoek)
    } else {
        query.delete("tekstsoek")
    }

    const side = sessionState.side
    if (side === 1) {
        query.delete("side")
    } else {
        query.set("side", sessionState.side.toString())
    }

    if (sessionState.bedrift !== undefined) {
        query.set("bedrift", sessionState.bedrift)
    }

    query.set("virksomhetsnumre", sessionState.virksomhetsnumre.join(","))

    if (sessionState.sortering === GQL.SakSortering.Oppdatert) {
        query.delete("sortering")
    } else {
        query.set("sortering", sessionState.sortering);
    }

    return query.toString()
}

// Clear sessionStorage with oversikts-filter.
export const useOversiktsfilterClearing = () => {
    const [, , deleteFromSession] = useSessionStorage<SessionState | undefined>(SESSION_STORAGE_KEY, undefined)
    useEffect(() => {
        deleteFromSession()
    }, [])
}

export const useRestoreSessionFromStorage = () => {
    const [storedSession] = useSessionStorage<SessionState | undefined>(SESSION_STORAGE_KEY, undefined)
    const location = useLocation()
    const navigate = useNavigate();

    return () => {
        if (storedSession?.route === '/saksoversikt') {
            const search = updateSearchParameters(location.search, storedSession)
            navigate({pathname: "/saksoversikt", search}, {replace: true})
        } else if (storedSession?.route === '/') {
            const search = storedSession.bedrift === undefined ? undefined : `bedrift=${storedSession.bedrift}`
            navigate({pathname: "/", search}, {replace: true})
        } else {
            navigate({pathname: "/saksoversikt"}, {replace: true})
        }
    }
}
