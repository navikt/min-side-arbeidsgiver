import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Undertittel } from 'nav-frontend-typografi';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import bedriftinfoikon from './infoombedriftikon.svg';
import './Bedriftsinfoknapp.less';

const Bedriftsinfoknapp = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const loggAtKlikketPaBedriftInfo = () => {
        //loggNavigasjonTilTjeneste('bedrifsinfo');
    };

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    return (
        <Lenkepanel
            href="/bedriftsinformasjon"
            className="bedriftsinfo-knapp"
            tittelProps="undertittel"
            onClick={loggAtKlikketPaBedriftInfo}
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
        </Lenkepanel>
    );
};

export default Bedriftsinfoknapp;