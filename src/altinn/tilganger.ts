import { AltinnFellesInfo, AltinnId, altinntjeneste } from './tjenester';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import * as Record from '../utils/Record';

type Orgnr = string;

export const hentAltinntilganger = async (): Promise<Record<AltinnId, Set<Orgnr>>> => {
    const enkelttilganger = await Promise.all(Record.fold(altinntjeneste, hentEnAltinntilganger));
    return Record.fromEntries(enkelttilganger);
};

const hentEnAltinntilganger = async (
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

