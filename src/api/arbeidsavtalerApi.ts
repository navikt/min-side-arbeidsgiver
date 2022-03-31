import { hentArbeidsavtalerApiLink } from '../lenker';
import { Organisasjon } from '../altinn/organisasjon';

export interface Arbeidsavtale {
    status: string;
    tiltakstype: string;
}

export async function hentArbeidsavtaler(
    valgtOrganisasjon: Organisasjon,
): Promise<Array<Arbeidsavtale>> {
    const respons = await fetch(
        hentArbeidsavtalerApiLink + 'bedriftNr=' + valgtOrganisasjon.OrganizationNumber,
    );
    if (respons.ok) {
        return respons.json();
    }
    return [];
}