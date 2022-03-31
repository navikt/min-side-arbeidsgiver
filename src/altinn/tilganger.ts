import { altinntjeneste, AltinnFellesInfo, AltinntjenesteId } from './tjenester';
import * as Record from '../utils/Record';
import { Organisasjon } from './organisasjon';

type Orgnr = string;

export const hentAltinntilganger = async (): Promise<Record<AltinntjenesteId, Set<Orgnr>>> => {
    const enkelttilganger = await Promise.all(
        Record.fold(altinntjeneste, hentAltinntilgangerForEnTjeneste)
    );
    return Record.fromEntries(enkelttilganger);
};

const hentAltinntilgangerForEnTjeneste = async (
    id: AltinntjenesteId,
    tjeneste: AltinnFellesInfo
): Promise<[AltinntjenesteId, Set<Orgnr>]> => {
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
    altinnId: AltinntjenesteId;
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
        serviceCode: altinntjeneste[skjema.altinnId].tjenestekode,
        serviceEdition: parseInt(altinntjeneste[skjema.altinnId].tjenesteversjon)
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
