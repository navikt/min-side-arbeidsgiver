import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    OrganisasjonerOgTilgangerContext,
    OrganisasjonInfo,
} from './OrganisasjonerOgTilgangerProvider';
import { useLoggBedriftValgtOgTilganger } from '../utils/funksjonerForAmplitudeLogging';
import { Organisasjon } from '../altinn/organisasjon';
import { useSaker } from './Saksoversikt/useSaker';
import { SakSortering } from '../api/graphql-types';
import { Map, Record, Set } from 'immutable';
import { values } from '../utils/Record';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: OrganisasjonInfo | undefined;
    antallSakerForAlleBedrifter: number | undefined;
    hovedenhetOrganisasjonsform: string | undefined;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonInfo | undefined>(
        organisasjoner[sessionStorage.getItem('bedrift') ?? '']
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

    const hentHovedenhetOrganisasjonsform = (org: Organisasjon | undefined): string | undefined => {
        if (org === undefined) return undefined;

        if (organisasjoner[org.ParentOrganizationNumber] === undefined) return org.OrganizationForm;

        return hentHovedenhetOrganisasjonsform(
            organisasjoner[org.ParentOrganizationNumber]?.organisasjon
        );
    };

    const hovedenhetOrganisasjonsform = hentHovedenhetOrganisasjonsform(
        valgtOrganisasjon?.organisasjon
    );

    let defaultContext: Context = {
        endreOrganisasjon,
        valgtOrganisasjon,
        antallSakerForAlleBedrifter,
        hovedenhetOrganisasjonsform: hovedenhetOrganisasjonsform,
    };
    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
