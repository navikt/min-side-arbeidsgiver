import React, { FunctionComponent, useContext, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import { Tilgang } from '../LoginBoundary';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import { AltinnContainer } from './AltinnContainer/AltinnContainer';
import { FeilmeldingContainer } from './FeilmeldingContainer/FeilmeldingContainer';
import { SkjemaveilederContainer } from './SkjemaveilederContainer/SkjemaveilederContainer';
import BeOmTilgang from './BeOmTilgang/BeOmTilgang';
import { Koronaboks } from '../Koronaboks/Koronaboks';
import Banner from '../HovedBanner/HovedBanner';
import './Hovedside.less';
import BrevFraAltinnContainer from './AltinnMeldingsboks/BrevFraAltinnContainer';
import * as Record from '../../utils/Record'

const Hovedside: FunctionComponent<RouteComponentProps> = ({ history }) => {
    const { organisasjoner, visFeilmelding, tilgangTilSyfo, visSyfoFeilmelding } = useContext(OrganisasjonerOgTilgangerContext);

    useEffect(() => {
        const skalViseManglerTilgangBoks = !(
            Record.length(organisasjoner) > 0 || tilgangTilSyfo === Tilgang.TILGANG
        );

        if (skalViseManglerTilgangBoks) {
            history.replace({ pathname: 'mangler-tilgang' });
        }
    }, [organisasjoner, tilgangTilSyfo, history]);

    return (
        <>
            <Banner sidetittel="Min side – arbeidsgiver" />
            <div className="hovedside">
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
                <BeOmTilgang />
            </div>
        </>
    );
};

export default withRouter(Hovedside);
