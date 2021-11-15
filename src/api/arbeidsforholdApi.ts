export type overSiktPerUnderenhetPar = {
    first: string;
    second: number;
};

export async function hentAntallArbeidsforholdFraAareg(
    underenhet: string,
    enhet: string,
): Promise<number> {
    let respons = await fetch(
        '/min-side-arbeidsgiver/api/antall-arbeidsforhold'
        , {
            headers: {
                'jurenhet': enhet,
                'orgnr': underenhet,
            },
        });
    if (respons.ok) {
        const jsonRespons: overSiktPerUnderenhetPar = await respons.json();
        if (jsonRespons.second === 0) {
            return -1;
        }
        return jsonRespons.second;
    } else {
        return -1;
    }
}

