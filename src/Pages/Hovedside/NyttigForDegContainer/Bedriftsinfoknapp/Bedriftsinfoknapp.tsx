import React from 'react';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import bedriftinfoikon from './infoombedriftikon.svg';
import './Bedriftsinfoknapp.css';
import { InternalLenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import { TittelMedIkon } from '../../../../GeneriskeElementer/TittelMedIkon';

const Bedriftsinfoknapp = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    return (
        <InternalLenkepanelMedLogging
            to={'/bedriftsinformasjon'}
            onClick={() => scroll(0, 0)}
            className="bedriftsinfo-knapp"
            loggLenketekst="Informasjon om din virksomhet"
        >
            <TittelMedIkon tittel={'Om virksomheten'} ikon={bedriftinfoikon} />
        </InternalLenkepanelMedLogging>
    );
};

export default Bedriftsinfoknapp;
