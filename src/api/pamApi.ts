export const settBedriftIPam = (orgnr: string): Promise<unknown> =>
    fetch(`/min-side-arbeidsgiver/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`, {
        method: 'POST',
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

export const hentAntallannonser = async (orgnr: string): Promise<number> => {
    const respons = await fetch(
        '/min-side-arbeidsgiver/stillingsregistrering-api/api/stillinger/numberByStatus',
        {
            method: 'GET',
            headers: {
                organizationNumber: orgnr,
            },
        }
    );
    if (respons.ok) {
        const responsBody: PamStatusAnnonser = await respons.json();
        return responsBody.PUBLISERT;
    }
    return 0;
};
