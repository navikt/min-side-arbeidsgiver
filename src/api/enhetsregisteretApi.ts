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

export async function hentUnderenhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret | undefined> {
    const respons = await fetch(hentUnderenhetApiURL(orgnr)).catch(_ => undefined);
    if (respons !== undefined && respons.ok) {
        return await respons.json();
    } else {
        return undefined
    }
}

export async function hentOverordnetEnhet(orgnr: string): Promise<OrganisasjonFraEnhetsregisteret | undefined> {
    const respons = await fetch(hentOverordnetEnhetApiLink(orgnr)).catch(_ => undefined);
    if (respons !== undefined && respons.ok) {
        return await respons.json();
    } else {
        return undefined
    }
}

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgNr: string[],
): Promise<Organisasjon[]> {
    let url: string = gittMiljo({
        prod: 'https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=',
        other: '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=',
    });
    const distinkteJuridiskeEnhetsnr: string[] = listeMedJuridiskeOrgNr.filter(
        (jurOrg, index) => listeMedJuridiskeOrgNr.indexOf(jurOrg) === index,
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
