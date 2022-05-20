import React, {FunctionComponent, useContext, useEffect} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {OrganisasjonerOgTilgangerContext} from '../OrganisasjonerOgTilgangerProvider';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import AdvarselBannerTestversjon from './AdvarselBannerTestVersjon/AdvarselBannerTestversjon';
import {VarselHvisNedetid} from '../LoggInn/VarselOmNedetid/VarselHvisNedetid';
import {Alerts} from '../Alerts/Alerts';
import {Koronaboks} from './Koronaboks/Koronaboks';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import {SkjemaveilederContainer} from './SkjemaveilederContainer/SkjemaveilederContainer';
import BeOmTilgang from './BeOmTilgang/BeOmTilgang';
import BrevFraAltinnContainer from './AltinnMeldingsboks/BrevFraAltinnContainer';
import './Hovedside.less';
import {GiOssTilbakemelding} from './GiOssTilbakemeldingComponent/GiOssTilbakemelding';
import {inkluderInnsynISakFeatureToggle} from "../../FeatureToggleProvider";
import SisteSaker from "./Sak/SisteSaker/SisteSaker";
import {UndersokelseInntektsmelding} from './UndersokelseInntektsmelding/UndersokelseInntektsmelding';
import {LinkMedLogging} from "../../GeneriskeElementer/LinkMedLogging";
import {KontaktFelt} from "./KontaktFelt/KontaktFelt"


const Hovedside: FunctionComponent<RouteComponentProps> = ({ history }) => {
    const { organisasjoner, visFeilmelding, tilgangTilSyfo, visSyfoFeilmelding, harTilganger } = useContext(
        OrganisasjonerOgTilgangerContext,
    );
    useEffect(() => {
        const skalViseManglerTilgangBoks =
            !harTilganger &&
            !visFeilmelding &&
            !visSyfoFeilmelding;

        if (skalViseManglerTilgangBoks) {
            history.replace({ pathname: 'mangler-tilgang' });
        }
    }, [organisasjoner, tilgangTilSyfo, history, visFeilmelding, visSyfoFeilmelding, harTilganger]);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return (
        <div>
            <Brodsmulesti brodsmuler={[]} />
            <div className='hovedside-container'>
                <AdvarselBannerTestversjon />
                <VarselHvisNedetid />
                <GiOssTilbakemelding />
                <UndersokelseInntektsmelding />
                <Alerts />
                { inkluderInnsynISakFeatureToggle ? <SisteSaker /> : null }
                <TjenesteBoksContainer />
                <SkjemaveilederContainer />
                <Koronaboks />
                <BrevFraAltinnContainer />
                <NyttigForDegContainer />
                <BeOmTilgang />
                <LinkMedLogging to={'/informasjon-om-tilgangsstyring'} loggLenketekst='Lær om tilganger og varsler i Altinn'>
                    Lær om tilganger og varsler i Altinn
                </LinkMedLogging>

            </div>
            <KontaktFelt/>
        </div>
    );
};

export default withRouter(Hovedside);
