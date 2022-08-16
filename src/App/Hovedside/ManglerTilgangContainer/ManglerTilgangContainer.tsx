import React, {FunctionComponent, useContext} from 'react';
import {ManglerTilgangLenkePanel} from './ManglerTilgangLenkePanel/ManglerTilgangLenkePanel';
import {lenkeTilDittNavPerson, lenkeTilTilgangsstyringsInfo} from '../../../lenker';
import {OrganisasjonerOgTilgangerContext} from '../../OrganisasjonerOgTilgangerProvider';
import Brodsmulesti from '../../Brodsmulesti/Brodsmulesti';
import './ManglerTilgangContainer.less';
import {Heading} from "@navikt/ds-react";

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
                <Heading size="large" className={'mangler-tilgang-bakgrunn__innholdstittel'}>
                    Du mangler tilganger
                </Heading>
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
