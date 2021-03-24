import { pamSettBedriftURL, pamHentStillingsannonserURL } from '../lenker';

export const settBedriftIPam = (orgnr: string): Promise<unknown> =>
    fetch(pamSettBedriftURL(orgnr), {
        method: "GET",
        credentials: "include"
    })


interface PamStatusAnnonser {
    TIL_GODKJENNING: number;
    GODKJENT: number;
    PAABEGYNT: number;
    TIL_AVSLUTTING: number;
    AVSLUTTET: number;
    AVVIST: number;
    PUBLISERT: number;
}

//TODO TAG-378: finne ut hvilke annonser som regner som "aktive"

export const hentAntallannonser = async (): Promise<number> => {
    const respons = await fetch(pamHentStillingsannonserURL, {
        method: 'GET',
        credentials: 'include',
    });
    if (respons.ok) {
        const responsBody: PamStatusAnnonser = await respons.json();
        return responsBody.PUBLISERT;
    }
    // TODO TAG-378 Hvordan burde vi håndtere denne feilen? Snakke med resten av teamet
    return 0;
};

