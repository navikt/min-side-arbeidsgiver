// Keep oversiktsfilter up to date with query parameters.
// Store copy of oversikts-filter in sessionStorage

import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSessionStorage } from '../../../hooks/useStorage';
import { Filter } from './useOversiktStateTransitions';
import { Organisasjon } from '../Saksfilter/Virksomhetsmeny/Virksomhetsmeny';

const SESSION_STORAGE_KEY = 'saksoversiktfilter'

type SessionState = {
    side: number,
    tekstsoek: string,
    virksomhetsnumre: string[],
    sortering: GQL.SakSortering,
}

type OldSessionStateFormat = {
    side: number,
    tekstsoek: string,
    virksomhetsnummer: string | undefined,
    sortering: GQL.SakSortering,
}

const normalizeSessionState = (sessionState: SessionState | OldSessionStateFormat): SessionState => ({
    ...sessionState,
    virksomhetsnumre: 'virksomhetsnumre' in sessionState
        ? sessionState.virksomhetsnumre
        : sessionState.virksomhetsnummer === undefined
            ? []
            : [sessionState.virksomhetsnummer]
});


const filterToSessionState = (filter: Filter): SessionState => ({
    side: filter.side,
    tekstsoek: filter.tekstsoek,
    sortering: filter.sortering,
    virksomhetsnumre: filter.virksomheter.map(virksomhet => virksomhet.OrganizationNumber),
});

const equalVirksomhetsnumre = (a: SessionState, b: SessionState): boolean => {
    return a.virksomhetsnumre.length === b.virksomhetsnumre.length &&
        a.virksomhetsnumre.every(virksomhetsnummer => b.virksomhetsnumre.includes(virksomhetsnummer));
};

export const equalSessionState = (a: SessionState, b: SessionState): boolean =>
    a.side === b.side &&
    a.tekstsoek === b.tekstsoek &&
    equalVirksomhetsnumre(a, b) &&
    a.sortering === b.sortering

export const useSessionState = (alleVirksomheter: Organisasjon[]): [Filter, (filter: Filter) => void] => {
    const [sessionState, setSessionState] = useState<SessionState>(() =>
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
            console.log("writing to session store", {newSessionState})
            setSessionState(newSessionState)
        }
    }

    const filter = useMemo(() => {
        return {
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

const extractSearchParameters = (searchString: string): SessionState => {
    const search = new URLSearchParams(searchString)
    const sortering = (search.get("sortering") ?? GQL.SakSortering.Oppdatert) as GQL.SakSortering
    const sessionState = {
        virksomhetsnumre: search.get("virksomhetsnumre")?.split(",") ?? [],
        tekstsoek: search.get("tekstsoek") ?? '',
        side: Number.parseInt(search.get("side") ?? '1'),
        sortering: Object.values(GQL.SakSortering).includes(sortering) ? sortering : GQL.SakSortering.Oppdatert
    };
    console.log("extractSearchParameters", {searchString, sessionState})
    return sessionState
}

const updateSearchParameters = (current: string, sessionState: SessionState): string => {
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
    const [, , deleteFromSession] = useSessionStorage<SessionState | OldSessionStateFormat | undefined>(SESSION_STORAGE_KEY, undefined)
    useEffect(() => {
        deleteFromSession()
    }, [])
}

export const useRestoreSessionFromStorage = () => {
    const [storedSession] = useSessionStorage<SessionState | OldSessionStateFormat | undefined>(SESSION_STORAGE_KEY, undefined)
    const location = useLocation()
    const navigate = useNavigate();


    return () => {
        if (storedSession === undefined) {
            navigate({pathname: "/saksoversikt"}, {replace: true})
        } else {
            const search = updateSearchParameters(location.search, normalizeSessionState(storedSession))
            console.log("restore from session storage.", {search, storedSession})
            navigate({pathname: "/saksoversikt", search}, {replace: true})
        }
    }
}
