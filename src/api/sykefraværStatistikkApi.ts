export type Sykefraværsrespons = {
    type: string;
    label: string;
    prosent: number;
};


export async function hentSykefravær(
    orgnr: string

): Promise<Sykefraværsrespons> {
    let respons = await fetch(
        '/min-side-arbeidsgiver/api/sykefravaer'
);
    if (respons.ok) {
      return respons.json();
    }
    throw new Error('Feil ved kontakt med sykefravær.');
}

