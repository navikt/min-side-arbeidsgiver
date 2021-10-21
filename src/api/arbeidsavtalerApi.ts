import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { hentArbeidsavtalerApiLink } from '../lenker';

export interface Arbeidsavtale {
    status: string;
    tiltakstype: string;
}

export async function hentArbeidsavtaler(
    valgtOrganisasjon: Organisasjon
): Promise<Array<Arbeidsavtale>> {
    const respons = await fetch(
        hentArbeidsavtalerApiLink + '&bedriftNr=' + valgtOrganisasjon.OrganizationNumber
    );
    if (respons.ok) {
        return await respons.json();
    }
    return [];
}