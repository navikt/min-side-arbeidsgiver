import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import bedriftinfoikon from './infoombedriftikon.svg';
import './Bedriftsinfoknapp.less';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import {TittelMedIkon} from "../../../../GeneriskeElementer/TittelMedIkon";

const Bedriftsinfoknapp = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    return (
        <LenkepanelMedLogging
            href="/bedriftsinformasjon"
            className="bedriftsinfo-knapp"
            loggLenketekst="Informasjon om din virksomhet"
            tittelProps="undertittel"
            linkCreator={(props: any) => (
                <Link
                    to={props.href + '?bedrift=' + valgtOrganisasjon.organisasjon.OrganizationNumber}
                    {...props}
                >
                    {props.children}
                </Link>
            )}
        >
            <TittelMedIkon tittel={"Informasjon fra enhetsregisteret"} ikon={bedriftinfoikon}/>
        </LenkepanelMedLogging>
    );
};

export default Bedriftsinfoknapp;