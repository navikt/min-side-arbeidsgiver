import React, { FunctionComponent } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import './ManglerTilgangContainer.less';
import { ManglerTilgangLenkePanel } from './ManglerTilgangLenkePanel/ManglerTilgangLenkePanel';
import { lenkeTilDittNavPerson, lenkeTilTilgangsstyringsInfo } from '../../../lenker';

export const ManglerTilgangContainer: FunctionComponent = () => {
    return (
        <div>
            <Innholdstittel>Du mangler tilganger</Innholdstittel>
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
    );
};
