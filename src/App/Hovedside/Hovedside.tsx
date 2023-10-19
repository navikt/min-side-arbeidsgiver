import React, { FunctionComponent } from 'react';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import AdvarselBannerTestversjon from './AdvarselBannerTestVersjon/AdvarselBannerTestversjon';
import { Alerts } from '../Alerts/Alerts';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import { SkjemaveilederContainer } from './SkjemaveilederContainer/SkjemaveilederContainer';
import BeOmTilgang from './BeOmTilgang/BeOmTilgang';
import BrevFraAltinnContainer from './AltinnMeldingsboks/BrevFraAltinnContainer';
import './Hovedside.css';
import { GiOssTilbakemelding } from './GiOssTilbakemeldingComponent/GiOssTilbakemelding';
import SisteSaker from './Sak/SisteSaker/SisteSaker';
import { UndersokelseInntektsmelding } from './UndersokelseInntektsmelding/UndersokelseInntektsmelding';
import { KontaktFelt } from './KontaktFelt/KontaktFelt';
import { useOversiktsfilterClearing } from './Sak/Saksoversikt/useOversiktSessionStorage';
import { DigiSyfoBedriftsmenyInfo } from './DigiSyfoBedriftsmenyInfo';
import { AktueltRubrikk } from './Aktuelt/AktueltRubrikk';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { infoOmTilgangsstyringURL } from '../../lenker';
import { ForebyggeFraværInfoBoks } from './ForebyggeFraværInfoBoks';
import { Alert, Heading } from '@navikt/ds-react';
import { useVarslingStatus } from '../useVarslingStatus';

const Hovedside: FunctionComponent = () => {
    useOversiktsfilterClearing();

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return (
        <div>
            <Brodsmulesti brodsmuler={[]} />
            <div className="hovedside-container">
                <AdvarselBannerTestversjon />
                <UndersokelseInntektsmelding />
                <Alerts />
                <ManglerKofuviAlert />
                <DigiSyfoBedriftsmenyInfo />
                <ForebyggeFraværInfoBoks />
                <AktueltRubrikk />
                <SisteSaker />
                <TjenesteBoksContainer />
                <GiOssTilbakemelding />
                <SkjemaveilederContainer />
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
            <KontaktFelt />
        </div>
    );
};

const ManglerKofuviAlert = () => {
    const varslingStatus = useVarslingStatus();

    if (varslingStatus.status !== 'MANGLER_KOFUVI') {
        return null;
    }

    return (
        <div role="status">
            <Alert variant="error" role="status">
                <Heading spacing size="small" level="2">
                    Virksomheten må legge inn varslingsadresse
                </Heading>
                Virksomheten mangler varslingsadresse (en e-post eller et mobilnummer). Virksomheten
                din må legge inn dette slik at NAV kan kommunisere digitalt med dere. <br />
                <LenkeMedLogging
                    href="https://www.altinn.no/hjelp/profil/kontaktinformasjon-og-varslinger/"
                    loggLenketekst="Les om varslingsadresse i Altinn"
                >
                    Les om varslingsadresse i Altinn
                </LenkeMedLogging>
            </Alert>
        </div>
    );
};

export default Hovedside;
