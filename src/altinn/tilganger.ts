import { alleAltinntjenster, AltinnFellesInfo, AltinnId } from './tjenester';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import * as Record from '../utils/Record';

type Orgnr = string;

export const hentAltinntilganger = async (): Promise<Record<AltinnId, Set<Orgnr>>> => {
    const enkelttilganger = await Promise.all(
        Record.fold(alleAltinntjenster, hentAltinntilgangerForEnTjeneste)
    );
    return Record.fromEntries(enkelttilganger);
};

const hentAltinntilgangerForEnTjeneste = async (
    id: AltinnId,
    tjeneste: AltinnFellesInfo
): Promise<[AltinnId, Set<Orgnr>]> => {
    const respons = await fetch(
        '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=' +
            tjeneste.tjenestekode +
            '&serviceEdition=' +
            tjeneste.tjenesteversjon
    );

    let organisasjoner: Organisasjon[] = [];

    if (respons.ok) {
        organisasjoner = await respons.json();
    }

    if (id === 'iaweb') {
        organisasjoner = organisasjoner.filter(_ => _.OrganizationForm === 'BEDR');
    }

    const orgnr = organisasjoner.map(_ => _.OrganizationNumber);
    return [id, new Set(orgnr)];
};

const altinnTilgangssøknadUrl = '/min-side-arbeidsgiver/api/altinn-tilgangssoknad';

export interface AltinnTilgangssøknad {
    orgnr: string;
    serviceCode: string;
    serviceEdition: string;
    status: string;
    cratedDateTime: string;
    lastChangedDateTime: string;
    submitUrl: string;
}

export const hentAltinnTilgangssøknader = async () => {
    const response = await fetch(altinnTilgangssøknadUrl);

    if (!response.ok) {
        throw new Error();
    }
    return (await response.json()) as AltinnTilgangssøknad[];
};

export interface AltinnTilgangssøknadskjema {
    orgnr: string;
    redirectUrl: string;
    altinnId: AltinnId;
}

export interface AltinnTilgangssøknadskjemaDTO {
    orgnr: string;
    redirectUrl: string;
    serviceCode: string;
    serviceEdition: number;
}

export const opprettAltinnTilgangssøknad = async (skjema: AltinnTilgangssøknadskjema): Promise<AltinnTilgangssøknad | null> => {
    const dto: AltinnTilgangssøknadskjemaDTO = {
        orgnr: skjema.orgnr,
        redirectUrl: skjema.redirectUrl,
        serviceCode: alleAltinntjenster[skjema.altinnId].tjenestekode,
        serviceEdition: parseInt(alleAltinntjenster[skjema.altinnId].tjenesteversjon)
    }

    const response = await fetch(altinnTilgangssøknadUrl, {
       'method' : 'POST',
        body: JSON.stringify(dto),
        headers: {
           'content-type': 'application/json',
           'accept': 'application/json'
        }
    });

    if (!response.ok) {
        return null;
    }

    return await response.json() as AltinnTilgangssøknad;
};
