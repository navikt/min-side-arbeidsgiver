import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import bedriftinfoikon from './infoombedriftikon.svg';
import './Bedriftsinfoknapp.less';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';

const Bedriftsinfoknapp = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    return (
        <LenkepanelMedLogging
            href="/bedriftsinformasjon"
            className="bedriftsinfo-knapp"
            loggTekst="bedriftsinfoknapp"
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
            <div className="bedriftsinfo-knapp__wrapper">
                <img className="bedriftsinfo-knapp__ikon" src={bedriftinfoikon} alt="" />
                <Undertittel className="bedriftsinfo-knapp__tekst">
                    Informasjon om din virksomhet
                </Undertittel>
            </div>
        </LenkepanelMedLogging>
    );
};

export default Bedriftsinfoknapp;