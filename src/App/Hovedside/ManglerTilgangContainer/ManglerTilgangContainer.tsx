import React, { FunctionComponent } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import './ManglerTilgangContainer.less';
import { ManglerTilgangLenkePanel } from './ManglerTilgangLenkePanel/ManglerTilgangLenkePanel';
import { lenkeTilDittNavPerson, lenkeTilTilgangsstyringsInfo } from '../../../lenker';
import Banner from '../../HovedBanner/HovedBanner';

export const ManglerTilgangContainer: FunctionComponent = () => {
    return (
        <>
        <Banner sidetittel="Min side – arbeidsgiver" />
        <div className="mangler-tilgang-bakgrunn ">
            <Innholdstittel className={'mangler-tilgang-bakgrunn__innholdstittel'}>Du mangler tilganger</Innholdstittel>
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
