import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    OrganisasjonerOgTilgangerContext,
    OrganisasjonInfo,
} from './OrganisasjonerOgTilgangerProvider';
import { useLoggBedriftValgtOgTilganger } from '../utils/funksjonerForAmplitudeLogging';
import { Organisasjon } from '../altinn/organisasjon';
import { useSaker } from './Saksoversikt/useSaker';
import { SakSortering } from '../api/graphql-types';
import { Set } from 'immutable';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: OrganisasjonInfo | undefined;
    antallSakerForAlleBedrifter: number | undefined;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonInfo | undefined>(
        undefined
    );

    const [antallSakerForAlleBedrifter, setAntallSakerForAlleBedrifter] = useState<
        number | undefined
    >(undefined);

    const { data, loading } = useSaker(0, {
        side: 1,
        virksomheter: Set(),
        tekstsoek: '',
        sortering: SakSortering.Opprettet,
        sakstyper: [],
        oppgaveTilstand: [],
    });

    useEffect(() => {
        if (loading) {
            return;
        }
        setAntallSakerForAlleBedrifter(data?.saker?.totaltAntallSaker);
    }, [data, loading]);

    const endreOrganisasjon = async (org: Organisasjon) => {
        const orgInfo = organisasjoner[org.OrganizationNumber];
        setValgtOrganisasjon(orgInfo);
    };

    useEffect(() => {
        if (valgtOrganisasjon !== undefined && organisasjoner !== undefined) {
            setValgtOrganisasjon(organisasjoner[valgtOrganisasjon.organisasjon.OrganizationNumber]);
        }
    }, [organisasjoner, valgtOrganisasjon]);

    useLoggBedriftValgtOgTilganger(valgtOrganisasjon);

    let defaultContext: Context = {
        endreOrganisasjon,
        valgtOrganisasjon,
        antallSakerForAlleBedrifter,
    };
    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
