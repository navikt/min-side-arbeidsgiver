import React, {FunctionComponent, useContext} from 'react';
import {Innholdstittel} from 'nav-frontend-typografi';
import {ManglerTilgangLenkePanel} from './ManglerTilgangLenkePanel/ManglerTilgangLenkePanel';
import {lenkeTilDittNavPerson, lenkeTilTilgangsstyringsInfo} from '../../../lenker';
import {OrganisasjonerOgTilgangerContext} from '../../OrganisasjonerOgTilgangerProvider';
import Brodsmulesti from '../../Brodsmulesti/Brodsmulesti';
import './ManglerTilgangContainer.less';

export const ManglerTilgangContainer: FunctionComponent = () => {
    const {harTilganger} = useContext(OrganisasjonerOgTilgangerContext);

    return (
        <>
            {harTilganger && (
                <Brodsmulesti
                    brodsmuler={[{url: '/mangler-tilgang', title: 'Du mangler tilganger', handleInApp: true,}]}
                />
            )}
            <div className="mangler-tilgang-bakgrunn ">
                <Innholdstittel className={'mangler-tilgang-bakgrunn__innholdstittel'}>
                    Du mangler tilganger
                </Innholdstittel>
                <span className="mangler-tilgang-container">
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
