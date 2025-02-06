import React from 'react';
import bedriftinfoikon from './infoombedriftikon.svg';
import './Bedriftsinfoknapp.css';
import { InternalLenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import { TittelMedIkon } from '../../../../GeneriskeElementer/TittelMedIkon';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

const Bedriftsinfoknapp = () => (
    <InternalLenkepanelMedLogging
        to={'/bedriftsinformasjon'}
        onClick={() => scroll(0, 0)}
        className="bedriftsinfo-knapp"
        loggLenketekst="Informasjon om din virksomhet"
    >
        <TittelMedIkon tittel={'Om virksomheten'} ikon={bedriftinfoikon} />
    </InternalLenkepanelMedLogging>
);

export default Bedriftsinfoknapp;
