// Keep oversiktsfilter up to date with query parameters.
// Store copy of oversikts-filter in sessionStorage

import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSessionStorage } from '../../../hooks/useStorage';
import { equalFilter, Filter } from './useOversiktStateTransitions';
import { Organisasjon } from '../Saksfilter/Virksomhetsmeny/Virksomhetsmeny';

const SESSION_STORAGE_KEY = 'saksoversiktfilter'

export type UseSessionState = [Filter, (sessionState: Filter) => void]

export const useSessionState = (alleVirksomheter: Organisasjon[]): UseSessionState => {
    const [sessionState, setSessionState] = useState<Filter>((): Filter => {
        return extractSeachParameters(window.location.search, alleVirksomheter)
    })

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const newSessionState = extractSeachParameters(location.search, alleVirksomheter)
        if (!equalFilter(sessionState, newSessionState)) {
            setSessionState(newSessionState)
        }
    }, [location.search])

    useEffect(() => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
    }, [sessionState])

    const update = (newSessionState: Filter) => {
        if (!equalFilter(sessionState, newSessionState)) {
            const search = updateSearchParameters(location.search, newSessionState)
            if (search !== location.search) {
                navigate({search}, {replace: true});
            }
            setSessionState(newSessionState)
        }
    }

    return [sessionState, update]
}

const extractSeachParameters = (searchString: string, alleVirksomheter: Organisasjon[]): Filter => {
    const search = new URLSearchParams(searchString)
    const sortering = (search.get("sortering") ?? GQL.SakSortering.Oppdatert) as GQL.SakSortering
    return {
        virksomheter: search
                .get("virksomhetsnumre")
                ?.split(",")
                ?.flatMap(orgnr => {
                    const org = alleVirksomheter.find(org => org.OrganizationNumber === orgnr)
                    return org === undefined ? [] : [org]
                })
            ?? [],
        tekstsoek: search.get("tekstsoek") ?? '',
        side: Number.parseInt(search.get("side") ?? '1'),
        sortering: Object.values(GQL.SakSortering).includes(sortering) ? sortering : GQL.SakSortering.Oppdatert
    }
}

const updateSearchParameters = (current: string, sessionState: Filter): string => {
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

    // @ts-ignore #backwardscompat: henter sessionState.virksomhetsnummer. Kan fjernes etterhvert
    if (sessionState.virksomhetsnummer !== undefined) {
        // @ts-ignore
        query.set("virksomhetsnumre", sessionState.virksomhetsnummer)
    }

    query.set("virksomhetsnumre", sessionState.virksomheter.map(it => it.OrganizationNumber).join(","))

    if (sessionState.sortering === GQL.SakSortering.Oppdatert) {
        query.delete("sortering")
    } else {
        query.set("sortering", sessionState.sortering);
    }

    return query.toString()
}

// Clear sessionStorage with oversikts-filter.
export const useOversiktsfilterClearing = () => {
    const [, , deleteFromSession] = useSessionStorage<Filter | undefined>(SESSION_STORAGE_KEY, undefined)
    useEffect(() => {
        deleteFromSession()
    }, [])
}

export const useRestoreSessionFromStorage = () => {
    const [storedSession] = useSessionStorage<Filter | undefined>(SESSION_STORAGE_KEY, undefined)
    const location = useLocation()
    const navigate = useNavigate();

    return () => {
        if (storedSession === undefined) {
            navigate({pathname: "/saksoversikt"}, {replace: true})
        } else {
            const search = updateSearchParameters(location.search, storedSession)
            navigate({pathname: "/saksoversikt", search}, {replace: true})
        }
    }
}
