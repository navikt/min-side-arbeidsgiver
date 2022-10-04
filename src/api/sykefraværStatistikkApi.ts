export type Sykefraværsrespons = {
    type: string;
    label: string;
    prosent: number;
};


export async function hentSykefravær(
    orgnr: string,
): Promise<Sykefraværsrespons> {
    let respons = await fetch(
        `/min-side-arbeidsgiver/sykefravaer/${orgnr}/sykefravarshistorikk/legemeldtsykefravarsprosent`,
    );
    if (respons.ok) {
        return respons.status === 204 ? undefined : respons.json();
    }
    throw new Error('Feil ved kontakt med sykefravær.');
}

