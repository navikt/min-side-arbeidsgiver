import { pamHentStillingsannonserLenke } from '../lenker';
import {logError, logInfo} from '../utils/metricsUtils';

export interface PamStatusAnnonser {
    TIL_GODKJENNING: number;
    GODKJENT: number;
    PAABEGYNT: number;
    TIL_AVSLUTTING: number;
    AVSLUTTET: number;
    AVVIST: number;
    PUBLISERT: number;
}

const hentAntallannonser = async (): Promise<number> => {
    logInfo('hent annonser');
    const respons = await fetch(pamHentStillingsannonserLenke(), {
        method: 'GET',
        credentials: 'include',
    });
    if (respons.ok) {
        const responsBody: PamStatusAnnonser = await respons.json();
        return responsBody.PUBLISERT;
    }
    logError("Kunne ikke hente annonser fra PAM. STATUS: " + respons.status);
    return 0;
};

export default hentAntallannonser;
