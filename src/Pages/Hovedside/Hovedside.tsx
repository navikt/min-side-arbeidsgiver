import React, { FunctionComponent } from 'react';
import AdvarselBannerTestversjon from './AdvarselBannerTestversjon';
import { Alerts } from '../Alerts';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import { SøknaderOgSkjemaer } from './SøknaderOgSkjemaer';
import BeOmTilgang from './BeOmTilgang/BeOmTilgang';
import BrevFraAltinnContainer from './BrevFraAltinnContainer';
import './Hovedside.css';
import { GiOssTilbakemelding } from './GiOssTilbakemelding';
import SisteSaker from './SisteSaker';
import { TrengerDuHjelp } from './TrengerDuHjelp';
import { useOversiktsfilterClearing } from '../Saksoversikt/useOversiktSessionStorage';
import { AktueltRubrikk } from './AktueltRubrikk';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { infoOmTilgangsstyringURL } from '../../lenker';
import { ManglerKofuviAlert } from './ManglerKofuviAlert';

const Hovedside: FunctionComponent = () => {
    useOversiktsfilterClearing();

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return (
        <div>
            <div className="hovedside-container">
                <AdvarselBannerTestversjon />
                <Alerts />
                <ManglerKofuviAlert />
                <AktueltRubrikk />
                <SisteSaker />
                <TjenesteBoksContainer />
                <GiOssTilbakemelding />
                <SøknaderOgSkjemaer />
                <BrevFraAltinnContainer />
                <NyttigForDegContainer />
                <BeOmTilgang />
                <div>
                    {' '}
                    {/*Legger inn en ekstra div for at linken ikke skal strekkes ut av flex*/}
                    <LenkeMedLogging
                        href={infoOmTilgangsstyringURL}
                        loggLenketekst="Lær om tilganger og varsler i Altinn"
                    >
                        Lær om tilganger og varsler i Altinn
                    </LenkeMedLogging>
                </div>
            </div>
            <TrengerDuHjelp />
        </div>
    );
};

export default Hovedside;
