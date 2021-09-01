import React, { FunctionComponent, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { basename } from '../paths';
import Hovedside from './Hovedside/Hovedside';
import LoginBoundary from './LoginBoundary';
import { OrganisasjonerOgTilgangerProvider } from './OrganisasjonerOgTilgangerProvider';
import { OrganisasjonsDetaljerProvider } from './OrganisasjonDetaljerProvider';
import InformasjonOmTilgangsstyringSide from './InformasjonOmTilgangsstyringSide/InformasjonOmTilgangsstyringSide';
import InformasjonOmBedrift from './InformasjonOmBedrift/InformasjonOmBedrift';
import { FeatureToggleProvider } from '../FeatureToggleProvider';
import { ManglerTilgangContainer } from './Hovedside/ManglerTilgangContainer/ManglerTilgangContainer';
import { loggSidevisning } from '../utils/funksjonerForAmplitudeLogging';
import './App.less';
import { Innlogget, LoginContext, LoginProvider } from './LoginProvider';

const AmplitudeSidevisningEventLogger: FunctionComponent = props => {
    const location = useLocation();
    const {innlogget} = useContext(LoginContext)

    useEffect(() => {
        if (innlogget !== Innlogget.LASTER) {
            loggSidevisning(location.pathname, innlogget);
        }
    }, [location.pathname, innlogget]);

    return <>{props.children}</>;
}

const App: FunctionComponent = () => {
    return (
        <div className="typo-normal bakgrunnsside">
            <LoginProvider>
                <BrowserRouter basename={basename}>
                    <AmplitudeSidevisningEventLogger>
                        <Switch>
                            <Route
                                path="/informasjon-om-tilgangsstyring"
                                exact={true}
                                component={InformasjonOmTilgangsstyringSide}
                            />
                            <LoginBoundary>
                                <FeatureToggleProvider>
                                    <OrganisasjonerOgTilgangerProvider>
                                        <OrganisasjonsDetaljerProvider>
                                            <Switch>
                                                <Route
                                                    path="/bedriftsinformasjon"
                                                    exact={true}
                                                    component={InformasjonOmBedrift}
                                                />
                                                <Route
                                                    path="/mangler-tilgang"
                                                    exact={true}
                                                    component={ManglerTilgangContainer}
                                                />
                                                <Route path="/" exact={true} component={Hovedside} />
                                            </Switch>
                                        </OrganisasjonsDetaljerProvider>
                                    </OrganisasjonerOgTilgangerProvider>
                                </FeatureToggleProvider>
                            </LoginBoundary>
                        </Switch>
                    </AmplitudeSidevisningEventLogger>
                </BrowserRouter>
            </LoginProvider>
        </div>
    );
};

export default App;
