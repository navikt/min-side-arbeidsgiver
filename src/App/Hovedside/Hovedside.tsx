import React, { FunctionComponent, useContext, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import AdvarselBannerTestversjon from './AdvarselBannerTestVersjon/AdvarselBannerTestversjon';
import { VarselHvisNedetid } from '../LoggInn/VarselOmNedetid/VarselHvisNedetid';
import { FeilmeldingContainer } from './FeilmeldingContainer/FeilmeldingContainer';
import { Koronaboks } from './Koronaboks/Koronaboks';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import { AltinnContainer } from './AltinnContainer/AltinnContainer';
import { SkjemaveilederContainer } from './SkjemaveilederContainer/SkjemaveilederContainer';
import BeOmTilgang from './BeOmTilgang/BeOmTilgang';
import BrevFraAltinnContainer from './AltinnMeldingsboks/BrevFraAltinnContainer';
import './Hovedside.less';
import { GiOssTilbakemelding } from './GiOssTilbakemeldingComponent/GiOssTilbakemelding';
import {inkluderInnsynISakFeatureToggle} from "../../FeatureToggleProvider";
import InnsynISak from "./InnsynISak/InnsynISak";
import { UndersokelseInntektsmelding } from './UndersokelseInntektsmelding/UndersokelseInntektsmelding';


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
        <div className={'min-side-arbeidsgiver-wrapper'}>
            <Brodsmulesti brodsmuler={[]} />
            <div className='hovedside-container'>
                {/*<div className='hovedside'>*/}
                    <AdvarselBannerTestversjon />
                    <VarselHvisNedetid />
                    <GiOssTilbakemelding />
                    <UndersokelseInntektsmelding />
                    <FeilmeldingContainer
                        visFeilmelding={visFeilmelding}
                        visSyfoFeilmelding={visSyfoFeilmelding}
                    />
                    <Koronaboks />
                    { inkluderInnsynISakFeatureToggle ? <InnsynISak /> : null }
                    <TjenesteBoksContainer />
                    <SkjemaveilederContainer />
                    <BrevFraAltinnContainer />
                    <AltinnContainer />
                    <NyttigForDegContainer />
                    <BeOmTilgang />
                {/*</div>*/}
            </div>
        </div>
    );
};

export default withRouter(Hovedside);
