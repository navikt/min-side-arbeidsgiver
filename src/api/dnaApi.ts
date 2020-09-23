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
    fetch(sjekkInnloggetLenke, { signal: signal }).then(_ => _.ok);

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

interface KodeOgVersjon {
    kode: string;
    versjon: string;
}

export const hentOrganisasjonerMedTilgangTilAltinntjeneste = async ({
    kode,
    versjon,
}: KodeOgVersjon): Promise<Set<string>> => {
    const respons = await fetch(
        '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=' +
            kode +
            '&serviceEdition=' +
            versjon
    );

    if (respons.ok) {
        const orgs: Organisasjon[] = await respons.json();
        return new Set(orgs.map(_ => _.OrganizationNumber));
    } else {
        return new Set();
    }
};

type orgnr = string;
interface AltinnSkjemaTilganger {
    [skjemanavn: string]: Set<orgnr>;
}

export const hentTilgangForAlleAltinnskjema = async (
    altinnSkjemaer: AltinnSkjema[]
): Promise<AltinnSkjemaTilganger> => {
    const entries = await Promise.all(
        altinnSkjemaer.map(skjema =>
            hentOrganisasjonerMedTilgangTilAltinntjeneste(skjema).then(orgnr => [
                skjema.navn,
                orgnr,
            ])
        )
    );
    return Object.fromEntries(entries);
};
