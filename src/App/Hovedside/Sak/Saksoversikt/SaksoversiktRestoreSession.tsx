import { useRestoreSessionFromStorage } from './useOversiktSessionStorage';
import { useValgtOrganisasjon } from '../../../OrganisasjonDetaljerProvider';
import { useEffect } from 'react';

export const SaksoversiktRestoreSession = () => {
    const valgtOrganisasjon = useValgtOrganisasjon()
    const restore = useRestoreSessionFromStorage()

    useEffect(() => {
        restore()
    }, [valgtOrganisasjon])

    console.log("SaksoversiktRestoreSession", {valgtOrganisasjon})
    return null
}