export type PresenterteKandidaterrespons = {
    antallKandidater: number;
};

export async function hentPresenterteKandidater(
    orgnr: string,
): Promise<PresenterteKandidaterrespons> {
    const respons = await fetch(
        `/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater?virksomhetsnummer=${orgnr}`,
    );
    if (respons.ok) {
        return respons.json();
    }
    throw new Error('Feil ved kontakt med presenterte-kandidater-api.');
}

