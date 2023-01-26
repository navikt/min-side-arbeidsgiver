import {gittMiljo} from "../utils/environment";


const pamSettBedriftURL = gittMiljo({
    prod: (orgnr: string) =>
        `https://arbeidsplassen.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`,
    dev: (orgnr: string) =>
        `https://arbeidsplassen.dev.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`,
    other: (orgnr: string) =>
        `/min-side-arbeidsgiver/mock/arbeidsplassen.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`,
});
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

const pamHentStillingsannonserURL = gittMiljo({
    prod: 'https://arbeidsplassen.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus',
    dev: 'https://arbeidsplassen.dev.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus',
    other: '/min-side-arbeidsgiver/mock/arbeidsplassen.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus',
});
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

