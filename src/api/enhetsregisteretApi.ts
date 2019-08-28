import {
    tomEnhetsregOrg,
    OrganisasjonFraEnhetsregisteret,
} from '../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { hentOverordnetEnhetApiLink, hentUnderenhetApiLink } from '../lenker';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';

export async function hentUnderenhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    let respons = await fetch(hentUnderenhetApiLink(orgnr));
    if (respons.ok) {
        const enhet: OrganisasjonFraEnhetsregisteret = await respons.json();
        return enhet;
    }
    return tomEnhetsregOrg;
}

export async function hentOverordnetEnhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    if (orgnr !== '') {
        let respons = await fetch(hentOverordnetEnhetApiLink(orgnr));
        if (respons.ok) {
            const enhet: OrganisasjonFraEnhetsregisteret = await respons.json();
            return enhet;
        }
    }
    return tomEnhetsregOrg;
}

export async function hentAlleJuridiskeEnheter(listeMedJuridiskeOrgNr: string[]): Promise<string> {
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
    console.log('url: ', url);

    return '';
}
