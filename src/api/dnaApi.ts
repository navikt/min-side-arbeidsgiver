import {
    Organisasjon
} from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { SyfoKallObjekt } from '../Objekter/Organisasjoner/syfoKallObjekt';
import { digiSyfoNarmesteLederLink, hentArbeidsavtalerApiLink } from '../lenker';
import { AltinnSkjema } from '../OrganisasjonsListeProvider';
import environment from '../utils/environment';

export interface Arbeidsavtale {
    status: string;
}

export async function hentOrganisasjoner(): Promise<Organisasjon[]> {
    let respons = await fetch('/min-side-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new Error('Feil ved kontakt mot baksystem.');
    }
}

export async function hentOrganisasjonerIAweb(): Promise<Organisasjon[]> {
    let respons = await fetch(
        '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=3403&serviceEdition=2'
    );
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}

export interface SkjemaMedOrganisasjonerMedTilgang {
    Skjema: AltinnSkjema;
    OrganisasjonerMedTilgang: Organisasjon[];
}

export async function lagListeMedOrganisasjonerMedTilgangTilSkjema(
    skjema: AltinnSkjema
): Promise<SkjemaMedOrganisasjonerMedTilgang> {
    let listeMedOrganisasjoner: SkjemaMedOrganisasjonerMedTilgang = {
        Skjema: skjema,
        OrganisasjonerMedTilgang: await hentOrganisasjonerMedTilgangTilAltinntjeneste(
            skjema
        ),
    };
    return listeMedOrganisasjoner;
}

export async function hentTilgangForAlleAtinnskjema(
    altinnSkjemaer: AltinnSkjema[]
): Promise<SkjemaMedOrganisasjonerMedTilgang[]> {
    let returnObjekt: SkjemaMedOrganisasjonerMedTilgang[] = [];
    await Promise.all(
        altinnSkjemaer.map(async skjema => {
            let listeObjekt: SkjemaMedOrganisasjonerMedTilgang = await lagListeMedOrganisasjonerMedTilgangTilSkjema(
                skjema
            );
            returnObjekt.push(listeObjekt);
        })
    );
    return returnObjekt;
}

export async function hentOrganisasjonerMedTilgangTilAltinntjeneste(
    skjema: AltinnSkjema
): Promise<Organisasjon[]> {
    let respons;
    if (environment.MILJO ==='preprod-sbs' && skjema.testversjon) {
        respons = await fetch(
            '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=' +
            skjema.kode +
            '&serviceEdition=' + skjema.testversjon

        );
    }
    else {
        respons = await fetch(
            '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=' +
            skjema.kode +
            '&serviceEdition=' + skjema.versjon

        );
    }
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}

export async function hentSyfoTilgang(): Promise<boolean> {
    let respons = await fetch(digiSyfoNarmesteLederLink);
    if (respons.ok) {
        const syfoTilgang: SyfoKallObjekt = await respons.json();
        if (syfoTilgang.tilgang) {
            return true;
        }
        return false;
    }
    throw new Error('Feil ved kontakt mot baksystem.');
}

export async function hentArbeidstreningTilgang(
    valgtOrganisasjon: Organisasjon
): Promise<Array<Arbeidsavtale>> {
    let respons = await fetch(
        hentArbeidsavtalerApiLink() + '&bedriftNr=' + valgtOrganisasjon.OrganizationNumber
    );
    if (respons.ok) {
        const avtaler: Array<Arbeidsavtale> = await respons.json();
        return avtaler;
    }
    return [];
}
