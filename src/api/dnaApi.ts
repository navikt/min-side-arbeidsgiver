import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { SyfoKallObjekt } from '../Objekter/Organisasjoner/syfoKallObjekt';
import {
    digiSyfoNarmesteLederLink,
    hentArbeidsavtalerApiLink,
    sjekkInnloggetLenke,
} from '../lenker';

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

export async function hentSyfoTilgang(): Promise<boolean> {
    const respons = await fetch(digiSyfoNarmesteLederLink);
    if (respons.ok) {
        const syfoTilgang: SyfoKallObjekt = await respons.json();
        return syfoTilgang.tilgang;
    }
    throw new Error('Feil ved kontakt mot baksystem.');
}

export const sjekkInnlogget = (signal: any): Promise<boolean> =>
    fetch(sjekkInnloggetLenke, { signal: signal }).then(_ => _.ok);

export async function hentOrganisasjoner(): Promise<Organisasjon[]> {
    const respons = await fetch('/min-side-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new Error('Feil ved kontakt mot baksystem.');
    }
}
