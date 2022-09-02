import { hentArbeidsavtalerApiLink } from '../lenker';
import { Organisasjon } from '../altinn/organisasjon';

export interface Arbeidsavtale {
    status: string;
    tiltakstype: string;
}

export async function hentArbeidsavtaler(
    orgnr: string,
): Promise<Array<Arbeidsavtale>> {
    const respons = await fetch(hentArbeidsavtalerApiLink + 'bedriftNr=' + orgnr);
    if (respons.ok) {
        return respons.json();
    }
    return [];
}