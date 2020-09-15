import React, {FunctionComponent, useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.less';
import { basename } from '../paths';
import Hovedside from './Hovedside/Hovedside';
import LoginBoundary from './LoginBoundary';
import { OrganisasjonsListeProvider } from '../OrganisasjonsListeProvider';
import { OrganisasjonsDetaljerProvider } from '../OrganisasjonDetaljerProvider';
import { SyfoTilgangProvider } from '../SyfoTilgangProvider';
import InformasjonOmTilgangsstyringSide from './InformasjonOmTilgangsstyringSide/InformasjonOmTilgangsstyringSide';
import InformasjonOmBedrift from './InformasjonOmBedrift/InformasjonOmBedrift';
import { FeatureToggleProvider } from '../FeatureToggleProvider';
import { ManglerTilgangContainer } from './Hovedside/ManglerTilgangContainer/ManglerTilgangContainer';
import {loggBrukerLoggetInn} from "../utils/funksjonerForAmplitudeLogging";

const App: FunctionComponent = () => {

    useEffect(() => {
        loggBrukerLoggetInn()
    }, []);

    return (
        <div className="typo-normal">
            <BrowserRouter basename={basename}>
                <Switch>
                    <Route
                        path="/informasjon-om-tilgangsstyring"
                        exact={true}
                        component={InformasjonOmTilgangsstyringSide}
                    />
                    <LoginBoundary>
                        <FeatureToggleProvider>
                            <OrganisasjonsListeProvider>
                                <SyfoTilgangProvider>
                                    <OrganisasjonsDetaljerProvider>
                                        <div className="bakgrunnsside">
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
                                                <Route
                                                    path="/"
                                                    exact={true}
                                                    component={Hovedside}
                                                />
                                            </Switch>
                                        </div>
                                    </OrganisasjonsDetaljerProvider>
                                </SyfoTilgangProvider>
                            </OrganisasjonsListeProvider>
                        </FeatureToggleProvider>
                    </LoginBoundary>
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;
