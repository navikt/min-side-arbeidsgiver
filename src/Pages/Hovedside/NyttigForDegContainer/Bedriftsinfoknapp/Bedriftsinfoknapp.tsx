import React from 'react';
import bedriftinfoikon from './infoombedriftikon.svg';
import './Bedriftsinfoknapp.css';
import { InternalLenkepanel } from '../../../../GeneriskeElementer/Lenkepanel';
import { TittelMedIkon } from '../../../../GeneriskeElementer/TittelMedIkon';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

const Bedriftsinfoknapp = () => (
    <InternalLenkepanel
        to={'/bedriftsinformasjon'}
        onClick={() => scroll(0, 0)}
        className="bedriftsinfo-knapp"
    >
        <TittelMedIkon tittel={'Om virksomheten'} ikon={bedriftinfoikon} />
    </InternalLenkepanel>
);

export default Bedriftsinfoknapp;
