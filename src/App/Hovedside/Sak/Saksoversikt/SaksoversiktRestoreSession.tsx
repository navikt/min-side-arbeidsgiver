import { useRestoreSessionFromStorage } from './useOversiktSessionStorage';
import { useEffect } from 'react';
import { useSidetittel } from '../../../OrganisasjonDetaljerProvider';

export const SaksoversiktRestoreSession = () => {
    const restore = useRestoreSessionFromStorage()
    useSidetittel("Saksoversikt")

    useEffect(() => {
        restore()
    }, [])

    return null
}