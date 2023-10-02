import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    OrganisasjonerOgTilgangerContext,
    OrganisasjonInfo,
} from './OrganisasjonerOgTilgangerProvider';
import { loggBedriftValgtOgTilganger } from '../utils/funksjonerForAmplitudeLogging';
import { hentAntallannonser, settBedriftIPam } from '../api/pamApi';
import { Organisasjon } from '../altinn/organisasjon';
import { useSaker } from './Hovedside/Sak/useSaker';
import { SakSortering } from '../api/graphql-types';
import { Set } from 'immutable';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: OrganisasjonInfo | undefined;
    antallAnnonser: number;
    antallSakerForAlleBedrifter: number | undefined;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const [antallAnnonser, setantallAnnonser] = useState(-1);
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

        if (orgInfo.altinntilgang.rekruttering) {
            settBedriftIPam(orgInfo.organisasjon.OrganizationNumber).then(() =>
                hentAntallannonser(orgInfo.organisasjon.OrganizationNumber).then(setantallAnnonser)
            );
        } else {
            setantallAnnonser(0);
        }
    };

    useEffect(() => {
        if (valgtOrganisasjon !== undefined && organisasjoner !== undefined) {
            setValgtOrganisasjon(organisasjoner[valgtOrganisasjon.organisasjon.OrganizationNumber]);
        }
    }, [organisasjoner, valgtOrganisasjon]);

    useEffect(() => {
        loggBedriftValgtOgTilganger(valgtOrganisasjon);
    }, [valgtOrganisasjon]);

    let defaultContext: Context = {
        antallAnnonser,
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
