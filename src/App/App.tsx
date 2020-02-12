import React, { FunctionComponent } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.less';
import { basename } from '../paths';
import Hovedside from './Hovedside/Hovedside';
import Banner from './HovedBanner/HovedBanner';
import LoginBoundary from './LoginBoundary';
import { OrganisasjonsListeProvider } from '../OrganisasjonsListeProvider';
import { OrganisasjonsDetaljerProvider } from '../OrganisasjonDetaljerProvider';
import { SyfoTilgangProvider } from '../SyfoTilgangProvider';
import InformasjonOmTilgangsstyringSide from './InformasjonOmTilgangsstyringSide/InformasjonOmTilgangsstyringSide';
import InformasjonOmBedrift from './InformasjonOmBedrift/InformasjonOmBedrift';
import environment from '../utils/environment';
import amplitude from '../utils/amplitude';

const App: FunctionComponent = () => {
    amplitude.logEvent(' #min-side-arbeidsgiver logget pa i ' + environment.MILJO);

    return (
        <div className="typo-normal">
            <BrowserRouter basename={basename}>
                <div>
                    <Switch>
                        <Route
                            path="/informasjon-om-tilgangsstyring"
                            exact={true}
                            component={InformasjonOmTilgangsstyringSide}
                        />
                        <LoginBoundary>
                            <OrganisasjonsListeProvider>
                                <SyfoTilgangProvider>
                                    <OrganisasjonsDetaljerProvider>
                                        <Banner />
                                        <div className="bakgrunnsside">
                                            <Switch>
                                                <Route
                                                    path="/bedriftsinformasjon"
                                                    exact={true}
                                                    component={InformasjonOmBedrift}
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
                        </LoginBoundary>
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
