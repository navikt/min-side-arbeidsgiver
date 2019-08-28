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

export function settSammenJuridiskEnhetMedUnderOrganisasjoner(
    juridiskeEnheter: Organisasjon[],
    underEnheter: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] {
    const organisasjonsTre: JuridiskEnhetMedUnderEnheterArray[] = juridiskeEnheter.map(
        juridiskEnhet => {
            const underenheter = underEnheter.filter(
                underenhet =>
                    underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
            );

            const resultat = {
                JuridiskEnhet: juridiskEnhet,
                Underenheter: underenheter,
            };
            return resultat;
        }
    );
    return organisasjonsTre;
}

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
    const juridiskeEnheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.Type === 'Enterprise';
    });
    const undernheter = organisasjoner.filter(function(organisasjon: Organisasjon) {
        return organisasjon.OrganizationForm === 'BEDR';
    });

    let organisasjonsliste = settSammenJuridiskEnhetMedUnderOrganisasjoner(
        juridiskeEnheter,
        undernheter
    );
    let underenheterMedTilgangTilJuridiskEnhet: Organisasjon[] = [];
    organisasjonsliste.forEach(juridiskenhet => {
        underenheterMedTilgangTilJuridiskEnhet.push.apply(
            underenheterMedTilgangTilJuridiskEnhet,
            juridiskenhet.Underenheter
        );
    });
    let underEnheterUtenTilgangTilJuridiskEnhet: Organisasjon[] = organisasjoner.filter(
        organisasjon => {
            if (
                !underenheterMedTilgangTilJuridiskEnhet.includes(organisasjon) &&
                organisasjon.OrganizationForm === 'BEDR'
            )
                return (
                    !underenheterMedTilgangTilJuridiskEnhet.includes(organisasjon) &&
                    organisasjon.OrganizationForm === 'BEDR'
                );
        }
    );
    console.log('underenheterutentilgang, ', underEnheterUtenTilgangTilJuridiskEnhet);
    const juridiskeEnheterUtenTilgang = await hentAlleJuridiskeEnheter(
        underEnheterUtenTilgangTilJuridiskEnhet.map(org => org.ParentOrganizationNumber)
    );
    let organisasjonsListeUtenTilgangJuridisk: JuridiskEnhetMedUnderEnheterArray[] = settSammenJuridiskEnhetMedUnderOrganisasjoner(
        juridiskeEnheterUtenTilgang,
        underEnheterUtenTilgangTilJuridiskEnhet
    );

    return organisasjonsliste
        .concat(organisasjonsListeUtenTilgangJuridisk)
        .sort((a, b) => a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name));
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
