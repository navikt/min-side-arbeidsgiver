import React, { FunctionComponent, useEffect, useState } from 'react';
import { useLoggBedriftValgtOgTilganger } from '../utils/funksjonerForAmplitudeLogging';
import { useSaker } from './Saksoversikt/useSaker';
import { SakSortering } from '../api/graphql-types';
import { Set } from 'immutable';
import { Organisasjon } from '@navikt/virksomhetsvelger';
import { OrganisasjonsDetaljerContext } from './OrganisasjonsDetaljerContext';
import {
    OrganisasjonInfo,
    useOrganisasjonerOgTilgangerContext,
} from './OrganisasjonerOgTilgangerContext';

const VALGT_ORG_STORAGE = 'virksomhetsvelger_bedrift';
export const OrganisasjonsDetaljerProvider: FunctionComponent<{
    children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonInfo>(() => {
        const lagretOrg = organisasjonsInfo[localStorage.getItem(VALGT_ORG_STORAGE) ?? ''];
        return (
            lagretOrg ??
            Object.values(organisasjonsInfo).find(
                (o) => o.parent !== undefined && o.organisasjon.underenheter.length === 0
            )
        );
    });

    const [antallSakerForAlleBedrifter, setAntallSakerForAlleBedrifter] = useState<
        number | undefined
    >(undefined);

    const { data, loading } = useSaker(0, {
        side: 1,
        virksomheter: Set(),
        tekstsoek: '',
        sortering: SakSortering.NyesteFørst,
        sakstyper: [],
        oppgaveTilstand: [],
    });

    useEffect(() => {
        if (loading) {
            return;
        }
        setAntallSakerForAlleBedrifter(data?.saker?.totaltAntallSaker);
    }, [data, loading]);

    const endreOrganisasjon = (org: Organisasjon) => {
        localStorage.setItem(VALGT_ORG_STORAGE, org.orgnr);
        setValgtOrganisasjon(organisasjonsInfo[org.orgnr]);
    };

    useEffect(() => {
        if (valgtOrganisasjon !== undefined && organisasjonsInfo !== undefined) {
            setValgtOrganisasjon(organisasjonsInfo[valgtOrganisasjon.organisasjon.orgnr]);
        }
    }, [organisasjonsInfo, valgtOrganisasjon]);

    useLoggBedriftValgtOgTilganger(valgtOrganisasjon);

    return valgtOrganisasjon === undefined ? null : (
        <OrganisasjonsDetaljerContext.Provider
            value={{
                endreOrganisasjon,
                valgtOrganisasjon,
                antallSakerForAlleBedrifter,
            }}
        >
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
