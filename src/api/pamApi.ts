import { pamSettBedriftURL, pamHentStillingsannonserURL } from '../lenker';

export const settBedriftIPam = (orgnr: string): Promise<unknown> =>
    fetch(pamSettBedriftURL(orgnr), {
        method: 'GET',
        credentials: 'include',
    });


interface PamStatusAnnonser {
    TIL_GODKJENNING: number;
    GODKJENT: number;
    PAABEGYNT: number;
    TIL_AVSLUTTING: number;
    AVSLUTTET: number;
    AVVIST: number;
    PUBLISERT: number;
}

export const hentAntallannonser = async (): Promise<number> => {
    const respons = await fetch(pamHentStillingsannonserURL, {
        method: 'GET',
        credentials: 'include',
    });
    if (respons.ok) {
        const responsBody: PamStatusAnnonser = await respons.json();
        return responsBody.PUBLISERT;
    }
    return 0;
};

