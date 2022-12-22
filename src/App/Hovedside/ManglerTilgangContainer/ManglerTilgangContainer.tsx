import React, {FunctionComponent, useContext} from 'react';
import {ManglerTilgangLenkePanel} from './ManglerTilgangLenkePanel/ManglerTilgangLenkePanel';
import {lenkeTilDittNavPerson, lenkeTilTilgangsstyringsInfo} from '../../../lenker';
import {OrganisasjonerOgTilgangerContext} from '../../OrganisasjonerOgTilgangerProvider';
import Brodsmulesti from '../../Brodsmulesti/Brodsmulesti';
import './ManglerTilgangContainer.css';
import {Heading} from "@navikt/ds-react";

export const ManglerTilgangContainer: FunctionComponent = () => {
    return (
        <>
            <Brodsmulesti
                brodsmuler={[]}
            />
            <div className="mangler-tilgang-bakgrunn ">
                <Heading size="large" level="1" className={'mangler-tilgang-bakgrunn__innholdstittel'}>
                    Du mangler tilganger som arbeidsgiver
                </Heading>
                <span className="mangler-tilgang-container">
                    <ManglerTilgangLenkePanel
                        tittel="Se tjenester som privatperson"
                        infoTekst="Gå til din innloggede side"
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
