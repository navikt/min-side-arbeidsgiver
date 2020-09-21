import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { SyfoKallObjekt } from '../Objekter/Organisasjoner/syfoKallObjekt';
import {
    digiSyfoNarmesteLederLink,
    hentArbeidsavtalerApiLink,
    sjekkInnloggetLenke,
} from '../lenker';
import { AltinnSkjema } from '../App/OrganisasjonsListeProvider';

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
    fetch(sjekkInnloggetLenke, { signal: signal })
        .then(_ => _.ok);

export async function hentOrganisasjoner(): Promise<Organisasjon[]> {
    const respons = await fetch('/min-side-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new Error('Feil ved kontakt mot baksystem.');
    }
}

export async function hentOrganisasjonerIAweb(): Promise<Organisasjon[]> {
    const respons = await fetch(
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

export async function hentOrganisasjonerMedTilgangTilAltinntjeneste(
    skjema: AltinnSkjema
): Promise<Organisasjon[]> {
    const respons = await fetch(
        '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=' +
            skjema.kode +
            '&serviceEdition=' +
            skjema.versjon
    );

    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
}

export async function lagListeMedOrganisasjonerMedTilgangTilSkjema(
    skjema: AltinnSkjema
): Promise<SkjemaMedOrganisasjonerMedTilgang> {
    return {
        Skjema: skjema,
        OrganisasjonerMedTilgang: await hentOrganisasjonerMedTilgangTilAltinntjeneste(skjema),
    };
}

export async function hentTilgangForAlleAltinnskjema(
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
