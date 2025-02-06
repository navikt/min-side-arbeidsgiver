import React, { useContext } from 'react';
import * as Record from '../utils/Record';
import { AltinntjenesteId } from '../altinn/tjenester';
import Immutable from 'immutable';

export type orgnr = string;

export type Søknadsstatus =
    | { tilgang: 'søknad opprettet'; url: string }
    | { tilgang: 'søkt' }
    | { tilgang: 'godkjent' }
    | { tilgang: 'ikke søkt' };

export interface Organisasjon {
    orgnr: string;
    organisasjonsform: string;
    navn: string;
    underenheter: Organisasjon[];
}

export type OrganisasjonInfo = {
    øversteLedd: Organisasjon | undefined;
    parent: Organisasjon | undefined;
    organisasjon: Organisasjon;
    altinntilgang: Record<AltinntjenesteId, boolean>;
    syfotilgang: boolean;
    antallSykmeldte: number;
    reporteetilgang: boolean;
    refusjonstatustilgang: boolean;
    refusjonstatus: {
        KLAR_FOR_INNSENDING?: number;
    };
};
export type OrganisasjonerOgTilgangerContext = {
    organisasjonstre: Organisasjon[];
    organisasjonsInfo: Record<orgnr, OrganisasjonInfo>;
    organisasjonerFlatt: Organisasjon[];
    parentMap: Immutable.Map<string, string>;
    childrenMap: Immutable.Map<string, string[]>;
    altinnTilgangssøknad: Record<orgnr, Record<AltinntjenesteId, Søknadsstatus>>;
};

export const OrganisasjonerOgTilgangerContext =
    React.createContext<OrganisasjonerOgTilgangerContext>(undefined!);

export const useOrganisasjonerOgTilgangerContext = () => {
    const organisasjonerOgTilgangerContext = useContext(OrganisasjonerOgTilgangerContext);
    if (organisasjonerOgTilgangerContext === undefined) {
        throw new Error(
            'OrganisasjonerOgTilgangerContext må brukes inne i en OrganisasjonerOgTilgangerProvider'
        );
    }
    return organisasjonerOgTilgangerContext;
};
