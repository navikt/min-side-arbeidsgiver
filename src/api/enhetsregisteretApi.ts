import {
    OrganisasjonFraEnhetsregisteret,
    ListeMedJuridiskeEnheter,
} from '../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { hentOverordnetEnhetApiLink, hentUnderenhetApiURL } from '../lenker';
import {
    Organisasjon,
    tomAltinnOrganisasjon,
} from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { gittMiljo } from '../utils/environment';

export async function hentUnderenhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
    console.log("hentUnderenhet orgnr: ", orgnr)
    let respons = await fetch(hentUnderenhetApiURL(orgnr));
    if (respons.ok) {
        return await respons.json();
    }else {
        throw new Error(`Klarte ikke hente underenhetenhet fra ereg. Fikk statuskode: ${respons.status}, melding: ${respons.statusText}`);
    }
}

export async function hentOverordnetEnhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret> {
        let respons = await fetch(hentOverordnetEnhetApiLink(orgnr));
        if (respons.ok) {
            return await respons.json();
        }
        else {
            throw new Error(`Klarte ikke hente overenhet fra ereg. Fikk statuskode: ${respons.status}, melding: ${respons.statusText}`);
        }
}

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgNr: string[]
): Promise<Organisasjon[]> {
    let url: string = gittMiljo({
        prod: 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=',
        other: '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=',
    });
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
