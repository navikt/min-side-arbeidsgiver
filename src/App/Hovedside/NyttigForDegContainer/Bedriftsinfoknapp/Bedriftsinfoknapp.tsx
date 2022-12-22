import React, { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import bedriftinfoikon from './infoombedriftikon.svg';
import './Bedriftsinfoknapp.css';
import { InternalLenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import {TittelMedIkon} from "../../../../GeneriskeElementer/TittelMedIkon";

const Bedriftsinfoknapp = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    return (
        <InternalLenkepanelMedLogging
            to={"/bedriftsinformasjon" + '?bedrift=' + valgtOrganisasjon.organisasjon.OrganizationNumber}
            onClick={()=>scroll(0,0)}
            className="bedriftsinfo-knapp"
            loggLenketekst="Informasjon om din virksomhet"
        >
            <TittelMedIkon tittel={"Informasjon fra enhetsregisteret"} ikon={bedriftinfoikon}/>
        </InternalLenkepanelMedLogging>
    );
};

export default Bedriftsinfoknapp;