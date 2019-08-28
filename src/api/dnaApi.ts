import {
    Organisasjon,
    JuridiskEnhetMedUnderEnheterArray,
    tomAltinnOrganisasjon,
} from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { SyfoKallObjekt } from '../Objekter/Organisasjoner/syfoKallObjekt';
import { digiSyfoNarmesteLederLink, hentArbeidsavtalerApiLink, linkTilUnleash } from '../lenker';
import { OrganisasjonFraEnhetsregisteret } from '../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { logInfo } from '../utils/metricsUtils';
import { hentAlleJuridiskeEnheter, hentOverordnetEnhet } from './enhetsregisteretApi';

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

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
    let juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.Type === 'Enterprise';
    });
    let organisasjonsliste = juridiskeEnheter.map(juridiskEnhet => {
        const underenheter = organisasjoner.filter(
            underenhet => underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
        );
        return {
            JuridiskEnhet: juridiskEnhet,
            Underenheter: underenheter,
        };
    });
    let underenheterMedTilgangTilJuridiskEnhet: Organisasjon[] = [];
    organisasjonsliste.forEach(juridiskenhet => {
        underenheterMedTilgangTilJuridiskEnhet.push.apply(
            underenheterMedTilgangTilJuridiskEnhet,
            juridiskenhet.Underenheter
        );
    });
    let underEnheterUtenTilgangTilJuridiskEnhet: Organisasjon[] = organisasjoner.filter(
        organisasjon => {
            return (
                !underenheterMedTilgangTilJuridiskEnhet.includes(organisasjon) &&
                organisasjon.OrganizationForm === 'BEDR'
            );
        }
    );
    let juridiskeEnheterUtenTilgang: JuridiskEnhetMedUnderEnheterArray[] = [];
    underEnheterUtenTilgangTilJuridiskEnhet.forEach(async organisasjon => {
        juridiskeEnheterUtenTilgang.forEach(async juridiskeEnhetMedArray => {
            if (
                organisasjon.ParentOrganizationNumber ===
                    juridiskeEnhetMedArray.JuridiskEnhet.OrganizationNumber &&
                juridiskeEnheterUtenTilgang.includes(juridiskeEnhetMedArray)
            ) {
                console.log(!juridiskeEnheterUtenTilgang.includes(juridiskeEnhetMedArray));
                juridiskeEnhetMedArray.Underenheter.push(organisasjon);
            }
        });
        const telt: boolean = juridiskeEnheterUtenTilgang.some(
            jurorg =>
                jurorg.JuridiskEnhet.OrganizationNumber === organisasjon.ParentOrganizationNumber
        );
        if (!telt) {
            const jurEnhet: OrganisasjonFraEnhetsregisteret = await hentOverordnetEnhet(
                organisasjon.ParentOrganizationNumber
            );
            let jurEnhetAltinn: Organisasjon = tomAltinnOrganisasjon;
            jurEnhetAltinn.Name = jurEnhet.navn;
            jurEnhetAltinn.OrganizationNumber = jurEnhet.organisasjonsnummer;
            let jurEnhetMedListe: JuridiskEnhetMedUnderEnheterArray = {
                JuridiskEnhet: jurEnhetAltinn,
                Underenheter: [],
            };
            jurEnhetMedListe.Underenheter.push(organisasjon);
            juridiskeEnheterUtenTilgang.push(jurEnhetMedListe);
        }
    });
    console.log(
        'alle distinkte jurenheter: ',
        hentAlleJuridiskeEnheter(['914787521', '914787521', '975959171'])
    );
    console.log(juridiskeEnheterUtenTilgang);
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

export async function hentMenuToggle(toggleNavn: string): Promise<boolean> {
    let respons = await fetch(linkTilUnleash + '?feature=' + toggleNavn);
    if (respons.ok) {
        const fodselNrSomSkalSeNyMeny: boolean = await respons.json();
        return fodselNrSomSkalSeNyMeny;
    }
    return false;
}
