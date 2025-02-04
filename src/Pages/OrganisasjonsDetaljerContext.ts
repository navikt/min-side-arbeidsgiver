import React, { useContext } from 'react';
import { Organisasjon } from '@navikt/virksomhetsvelger';
import { OrganisasjonInfo } from './OrganisasjonerOgTilgangerContext';

export type OrganisasjonsDetaljerContext = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: OrganisasjonInfo;
    antallSakerForAlleBedrifter: number | undefined;
};

export const OrganisasjonsDetaljerContext = React.createContext<OrganisasjonsDetaljerContext>(
    undefined!
);

export const useOrganisasjonsDetaljerContext = () => {
    const context = useContext(OrganisasjonsDetaljerContext);
    if (context === undefined) {
        throw new Error(
            'useOrganisasjonsDetaljerContext må brukes innenfor en OrganisasjonsDetaljerProvider'
        );
    }
    return context;
};
