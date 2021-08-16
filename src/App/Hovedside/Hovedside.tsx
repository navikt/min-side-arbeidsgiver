import React, { FunctionComponent, useContext, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {OrganisasjonerOgTilgangerContext} from '../OrganisasjonerOgTilgangerProvider';
import { LinkableFragment } from '../../GeneriskeElementer/LinkableFragment';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import Banner from '../HovedBanner/HovedBanner';
import AdvarselBannerTestversjon from './AdvarselBannerTestVersjon/AdvarselBannerTestversjon';
import { VarselHvisNedetid } from '../LoggInn/VarselOmNedetid/VarselHvisNedetid';
import { FeilmeldingContainer } from './FeilmeldingContainer/FeilmeldingContainer';
import { Koronaboks } from '../Koronaboks/Koronaboks';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import { AltinnContainer } from './AltinnContainer/AltinnContainer';
import { SkjemaveilederContainer } from './SkjemaveilederContainer/SkjemaveilederContainer';
import BeOmTilgang from './BeOmTilgang/BeOmTilgang';
import BrevFraAltinnContainer from './AltinnMeldingsboks/BrevFraAltinnContainer';
import './Hovedside.less';
// @ts-ignore
import {NotifikasjonWidget} from '@navikt/arbeidsgiver-notifikasjon-widget'
import { inkluderNotifikasjonerFeatureToggle } from '../../FeatureToggleProvider';


const Hovedside: FunctionComponent<RouteComponentProps> = ({ history }) => {
    const { organisasjoner, visFeilmelding, tilgangTilSyfo, visSyfoFeilmelding, harTilganger } = useContext(
        OrganisasjonerOgTilgangerContext
    );

    useEffect(() => {
        const skalViseManglerTilgangBoks =
            !harTilganger &&
            !visFeilmelding &&
            !visSyfoFeilmelding;

        if (skalViseManglerTilgangBoks) {
            history.replace({ pathname: 'mangler-tilgang' });
        }
    }, [organisasjoner, tilgangTilSyfo, history, visFeilmelding, visSyfoFeilmelding,harTilganger]);

    return (
        <div className={'min-side-arbeidsgiver-wrapper'}>
            <Brodsmulesti brodsmuler={[]} />
            <Banner sidetittel="Min side – arbeidsgiver" />
            { inkluderNotifikasjonerFeatureToggle ? <NotifikasjonWidget apiUri="/min-side-arbeidsgiver/notifikasjon/api/graphql" /> : null }
            <div className="hovedside-container">
                <div className="hovedside">
                    <AdvarselBannerTestversjon />
                    <VarselHvisNedetid />
                    <FeilmeldingContainer
                        visFeilmelding={visFeilmelding}
                        visSyfoFeilmelding={visSyfoFeilmelding}
                    />
                    <Koronaboks />
                    <TjenesteBoksContainer />
                    <BrevFraAltinnContainer />
                    <NyttigForDegContainer />
                    <AltinnContainer />
                    <SkjemaveilederContainer />
                    <LinkableFragment fragment="be-om-tilgang">
                        <BeOmTilgang />
                    </LinkableFragment>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Hovedside);
