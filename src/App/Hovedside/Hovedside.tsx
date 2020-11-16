import React, { FunctionComponent, useContext, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import { Tilgang } from '../LoginBoundary';
import * as Record from '../../utils/Record';
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
import Varselpanel from './Varselpanel/Varselpanel';

const Hovedside: FunctionComponent<RouteComponentProps> = ({ history }) => {
    const { organisasjoner, visFeilmelding, tilgangTilSyfo, visSyfoFeilmelding } = useContext(
        OrganisasjonerOgTilgangerContext
    );

    useEffect(() => {
        const skalViseManglerTilgangBoks =
            !(Record.length(organisasjoner) > 0 || tilgangTilSyfo === Tilgang.TILGANG) &&
            !visFeilmelding &&
            !visSyfoFeilmelding;

        if (skalViseManglerTilgangBoks) {
            history.replace({ pathname: 'mangler-tilgang' });
        }
    }, [organisasjoner, tilgangTilSyfo, history, visFeilmelding, visSyfoFeilmelding]);

    return (
        <>
            <Brodsmulesti brodsmuler={[]} />
            <Banner sidetittel="Min side – arbeidsgiver" />
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
                <Varselpanel />
            </div>
        </>
    );
};

export default withRouter(Hovedside);
