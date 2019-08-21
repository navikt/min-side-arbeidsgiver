import {
    Organisasjon,
    OverenhetOrganisasjon,
    tomAltinnOrganisasjon,
} from '../Objekter/organisasjon';
import { SyfoKallObjekt } from '../syfoKallObjekt';
import { digiSyfoNarmesteLederLink, hentArbeidsavtalerApiLink } from '../lenker';
import { EnhetsregisteretOrg } from '../Objekter/enhetsregisteretOrg';
import { logInfo } from '../utils/metricsUtils';
import { hentOverordnetEnhet } from './enhetsregisteretApi';

export interface Rolle {
    RoleType: string;
    RoleDefinitionId: number;
    RoleName: string;
    RoleDescription: string;
}

enum AltinnKode {
    HelseSosialOgVelferdstjenester = 131,
    AnsvarligRevisor = 5602,
    LonnOgPersonalmedarbeider = 3,
    RegnskapsførerLønn = 5607,
    RegnskapsførerMedSignering = 5608,
    RegnskapsførerUtenSignering = 5609,
    Revisormedarbeider = 5610,
    KontaktPersonNUF = 188,
}

export interface Arbeidsavtale {
    status: string;
}

export async function hentOrganisasjoner(): Promise<Organisasjon[]> {
    let respons = await fetch('/ditt-nav-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}

export async function lagToDimensjonalArray(
    organisasjoner: Organisasjon[]
): Promise<OverenhetOrganisasjon[]> {
    let juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.Type === 'Enterprise';
    });
    let utenTilgangTilJuridiskEnhetBedrifter = organisasjoner;
    logInfo('juridiske enheter: ' + juridiskeEnheter);

    let organisasjonsliste = juridiskeEnheter.map(juridiskEnhet => {
        const underenheter = organisasjoner.filter(underenhet => {
            if (underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber) {
                utenTilgangTilJuridiskEnhetBedrifter = utenTilgangTilJuridiskEnhetBedrifter.filter(
                    organisasjon => {
                        return organisasjon.OrganizationNumber !== underenhet.OrganizationNumber;
                    }
                );
                return underenhet;
            }

            return false;
        });
        return {
            overordnetOrg: juridiskEnhet,
            UnderOrganisasjoner: underenheter,
        };
    });

    utenTilgangTilJuridiskEnhetBedrifter.forEach(async organisasjon => {
        if (organisasjon.OrganizationForm === 'BEDR') {
            const overordnetEnhetEReg: EnhetsregisteretOrg = await hentOverordnetEnhet(
                organisasjon.OrganizationNumber
            );
            let overordnetAltinnOrg: Organisasjon = tomAltinnOrganisasjon;
            overordnetAltinnOrg.OrganizationNumber = overordnetEnhetEReg.organisasjonsnummer;
            overordnetAltinnOrg.Name = overordnetEnhetEReg.navn;
            if (overordnetEnhetEReg.navn === '' && overordnetEnhetEReg.organisasjonsnummer === '') {
                overordnetAltinnOrg.Name = 'JURIDISK ENHET TEST';
                overordnetAltinnOrg.OrganizationNumber = '999999999';
            }
            overordnetAltinnOrg.Type = 'Enterprise';
            organisasjonsliste.push({
                overordnetOrg: overordnetAltinnOrg,
                UnderOrganisasjoner: [organisasjon],
            });
        }
    });

    console.log(organisasjonsliste);

    return organisasjonsliste;
}

export async function hentRoller(orgnr: string): Promise<Rolle[]> {
    let respons = await fetch('/ditt-nav-arbeidsgiver/api/roller/' + orgnr);
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}

export function sjekkAltinnRolleHelseSosial(rolleListe: Rolle[]): boolean {
    const rolle = rolleListe.find(
        rolle => AltinnKode.HelseSosialOgVelferdstjenester === rolle.RoleDefinitionId
    );
    return !!rolle;
}

export function sjekkAltinnRolleForInntekstmelding(rolleListe: Array<Rolle>): boolean {
    const koderSomGirTilgangTilInntekstmelding = [
        AltinnKode.AnsvarligRevisor,
        AltinnKode.LonnOgPersonalmedarbeider,
        AltinnKode.RegnskapsførerLønn,
        AltinnKode.RegnskapsførerMedSignering,
        AltinnKode.RegnskapsførerUtenSignering,
        AltinnKode.Revisormedarbeider,
        AltinnKode.KontaktPersonNUF,
    ];

    const listeMedRollerSomGirTilgang = rolleListe
        .map(rolle => rolle.RoleDefinitionId)
        .filter(kode => koderSomGirTilgangTilInntekstmelding.includes(kode));
    return listeMedRollerSomGirTilgang.length > 0;
}

export async function hentSyfoTilgang(): Promise<boolean> {
    let respons = await fetch(digiSyfoNarmesteLederLink);
    if (respons.ok) {
        const syfoTilgang: SyfoKallObjekt = await respons.json();
        if (syfoTilgang.tilgang) {
            logInfo('har syfotilgang');
            return true;
        }
    }
    return false;
}

export async function hentTiltaksgjennomforingTilgang(): Promise<Array<Arbeidsavtale>> {
    let respons = await fetch(hentArbeidsavtalerApiLink());
    if (respons.ok) {
        const avtaler: Array<Arbeidsavtale> = await respons.json();
        return avtaler;
    }
    return [];
}
