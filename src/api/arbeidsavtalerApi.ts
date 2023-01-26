export interface Arbeidsavtale {
    tiltakstype: string;
}

export async function hentArbeidsavtaler(
    orgnr: string,
): Promise<Array<Arbeidsavtale>> {
    const respons = await fetch(`/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler/min-side-arbeidsgiver?bedriftNr=${orgnr}`);
    if (respons.ok) {
        return respons.json();
    }
    return [];
}