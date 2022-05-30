import { useRestoreSessionFromStorage } from './useOversiktSessionStorage';
import { useEffect } from 'react';

export const SaksoversiktRestoreSession = () => {
    const restore = useRestoreSessionFromStorage()

    useEffect(() => {
        restore()
    }, [])

    return null
}