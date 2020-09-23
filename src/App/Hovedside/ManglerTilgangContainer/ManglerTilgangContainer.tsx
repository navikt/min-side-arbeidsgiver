import React, { FunctionComponent, useContext } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import './ManglerTilgangContainer.less';
import { ManglerTilgangLenkePanel } from './ManglerTilgangLenkePanel/ManglerTilgangLenkePanel';
import { lenkeTilDittNavPerson, lenkeTilTilgangsstyringsInfo } from '../../../lenker';
import Banner from '../../HovedBanner/HovedBanner';
import { Link } from 'react-router-dom';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { SyfoTilgangContext } from '../../../SyfoTilgangProvider';
import { Tilgang } from '../../LoginBoundary';
import * as Record from '../../../utils/Record';

export const ManglerTilgangContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { organisasjoner } = useContext(OrganisasjonsListeContext);
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);

    const harTilganger = Record.length(organisasjoner) > 0 || tilgangTilSyfoState === Tilgang.TILGANG;
    const bedriftsparameter =
        valgtOrganisasjon && valgtOrganisasjon.OrganizationNumber.length > 0
            ? '/?bedrift=' + valgtOrganisasjon.OrganizationNumber
            : '';

    return (
        <>
            <Banner sidetittel="Min side – arbeidsgiver" />
            <div className="mangler-tilgang-bakgrunn ">
                {harTilganger && (
                    <div className="mangler-tilgang-bakgrunn__brodsmule">
                        <Link to={bedriftsparameter} className="informasjon-om-bedrift__brodsmule">
                            Min side - arbeidsgiver
                        </Link>
                        {' / mangler-tilgang'}
                    </div>
                )}
                <Innholdstittel className={'mangler-tilgang-bakgrunn__innholdstittel'}>
                    Du mangler tilganger
                </Innholdstittel>
                <span className={'mangler-tilgang-container'}>
                    <ManglerTilgangLenkePanel
                        tittel="Se tjenester som privatperson"
                        infoTekst="Gå til Ditt NAV"
                        lenke={lenkeTilDittNavPerson}
                    />
                    <ManglerTilgangLenkePanel
                        tittel="Hvordan får jeg tilgang?"
                        infoTekst="Lær om roller og tilganger i Altinn"
                        lenke={lenkeTilTilgangsstyringsInfo}
                    />
                </span>
            </div>
        </>
    );
};
