import {
    tomEnhetsregOrg,
    OrganisasjonFraEnhetsregisteret,
    ListeMedJuridiskeEnheter,
} from '../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { hentOverordnetEnhetApiLink, hentUnderenhetApiLink } from '../lenker';
import {
    Organisasjon,
    tomAltinnOrganisasjon,
} from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';

export async function hentUnderenhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    let respons = await fetch(hentUnderenhetApiLink(orgnr));
    if (respons.ok) {
        return await respons.json();
    }
    return tomEnhetsregOrg;
}

export async function hentOverordnetEnhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    if (orgnr !== '') {
        let respons = await fetch(hentOverordnetEnhetApiLink(orgnr));
        if (respons.ok) {
            return await respons.json();
        }
    }
    return tomEnhetsregOrg;
}

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgNr: string[]
): Promise<Organisasjon[]> {
    let url: string = 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=';
    const distinkteJuridiskeEnhetsnr: string[] = listeMedJuridiskeOrgNr.filter(
        (jurOrg, index) => listeMedJuridiskeOrgNr.indexOf(jurOrg) === index
    );
    distinkteJuridiskeEnhetsnr.forEach(orgnr => {
        if (distinkteJuridiskeEnhetsnr.indexOf(orgnr) === 0) {
            url += orgnr;
        } else {
            url += ',' + orgnr;
        }
    });
    let respons = await fetch(url);
    if (respons.ok) {
        const distinkteJuridiskeEnheterFraEreg: ListeMedJuridiskeEnheter = await respons.json();
        if (distinkteJuridiskeEnheterFraEreg._embedded) {
            return distinkteJuridiskeEnheterFraEreg._embedded.enheter.map(orgFraEereg => ({
                ...tomAltinnOrganisasjon,
                Name: orgFraEereg.navn,
                OrganizationNumber: orgFraEereg.organisasjonsnummer,
            }));
        }
    }
    return [];
}
