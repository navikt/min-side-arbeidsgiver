

// Keep oversiktsfilter up to date with query parameters.
// Store copy of oversikts-filter in sessionStorage

import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useSessionStorage } from '../../../hooks/useStorage';
import { Filter } from './Filter';

const SESSION_STORAGE_KEY = 'saksoversiktfilter'

const sessionStateEqual = (a: Filter, b: Filter) => {
    return a.side === b.side &&
        a.tekstsoek === b.tekstsoek &&
        a.virksomhetsnummer === b.virksomhetsnummer
}

export type UseSessionState = [Filter, (sessionState: Filter) => void]

export const useSessionState = (): UseSessionState => {
    const [sessionState, setSessionState] = useState<Filter>(loadFilterFromUrl)

    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        const newSessionState = extractSeachParameters(location.search)
        if (!sessionStateEqual(sessionState, newSessionState)) {
            setSessionState(newSessionState)
        }
    }, [location.search])

    useEffect(() => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
    }, [sessionState])

    const update = (newSessionState: Filter) => {
        if (!sessionStateEqual(sessionState, newSessionState)) {
            const search = updateSearchParameters(location.search, newSessionState)
            if (search !== location.search) {
                history.replace({search})
            }
            setSessionState(newSessionState)
        }
    }

    return [sessionState, update]
}

const loadFilterFromUrl = (): Filter => {
    return extractSeachParameters(window.location.search)
}

const extractSeachParameters = (searchString: string): Filter => {
    const search = new URLSearchParams(searchString)
    return {
        virksomhetsnummer: search.get("bedrift") ?? '',
        tekstsoek: search.get("tekstsoek") ?? '',
        side: Number.parseInt(search.get("side") ?? '1')
    }
}

const updateSearchParameters = (current: string, sessionState: Filter): string => {
    const query = new URLSearchParams(current)

    if (sessionState.tekstsoek.length > 0) {
        query.set("tekstsoek", sessionState.tekstsoek)
    } else {
        query.delete("tekstsoek")
    }

    query.set("side", sessionState.side.toString())
    if (sessionState.virksomhetsnummer !== null) {
        query.set("bedrift", sessionState.virksomhetsnummer)
    }

    return query.toString()
}

// Clear sessionStorage with oversikts-filter.
export const useOversiktsfilterClearing = () => {
    const [ , , deleteFromSession] = useSessionStorage<Filter | undefined>(SESSION_STORAGE_KEY, undefined)
    useEffect(() => {
        deleteFromSession()
    }, [])
}

export const useRestoreSessionFromStorage = () => {
    const [storedSession] = useSessionStorage<Filter | undefined>(SESSION_STORAGE_KEY, undefined)
    const location = useLocation()
    const history = useHistory()

    return () => {
        if (storedSession === undefined) {
            history.replace({pathname: '/saksoversikt'})
        } else {
            const search = updateSearchParameters(location.search, storedSession)
            history.replace({pathname: '/saksoversikt', search})
        }
    }
}
