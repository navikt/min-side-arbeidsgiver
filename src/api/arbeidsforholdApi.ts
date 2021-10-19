export type overSiktPerUnderenhetPar = {
    first: string;
    second: number;
};

export async function hentAntallArbeidsforholdFraAareg(
    underenhet: string,
    enhet: string,
): Promise<number> {
    const headere = lagHeadere(enhet, underenhet);
    let respons = await fetch(
        '/min-side-arbeidsgiver/api/antall-arbeidsforhold/api/antall-arbeidsforhold'
        , { headers: headere });
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

const lagHeadere = (jurenhet: string, orgnr?: string) => {
    const headere = new Headers();
    headere.set('jurenhet', jurenhet);
    orgnr != null && headere.set('orgnr', orgnr);
    return headere;
};

