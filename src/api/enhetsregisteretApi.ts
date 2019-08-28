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
    console.log('url: ', url);
    let respons = await fetch(url);
    if (respons.ok) {
        const distinkteJuridiskeEnheterFraEreg: ListeMedJuridiskeEnheter = await respons.json();
        console.log('forste log', distinkteJuridiskeEnheterFraEreg);
        let distinkteJuridiskeEnheter: Organisasjon[] = distinkteJuridiskeEnheterFraEreg._embedded.enheter.map(
            orgFraEereg => {
                //console.log('jurorg i map er', orgFraEereg);
                const jurOrg: Organisasjon = {
                    ...tomAltinnOrganisasjon,
                    Name: orgFraEereg.navn,
                    OrganizationNumber: orgFraEereg.organisasjonsnummer,
                };
                console.log('jurorg:', jurOrg);
                return jurOrg;
            }
        );
        console.log('etter map ', distinkteJuridiskeEnheter);
        return distinkteJuridiskeEnheter;
    }

    return [];
}
