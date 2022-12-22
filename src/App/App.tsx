import React, {FunctionComponent, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Link as RouterLink, Routes, useLocation} from 'react-router-dom';
import {basename} from '../paths';
import Hovedside from './Hovedside/Hovedside';
import LoginBoundary from './LoginBoundary';
import {AlertsProvider} from './Alerts/Alerts';
import {OrganisasjonerOgTilgangerProvider} from './OrganisasjonerOgTilgangerProvider';
import {OrganisasjonsVelger} from './OrganisasjonDetaljerProvider';
import InformasjonOmTilgangsstyringSide from './InformasjonOmTilgangsstyringSide/InformasjonOmTilgangsstyringSide';
import InformasjonOmBedrift from './InformasjonOmBedrift/InformasjonOmBedrift';
import {FeatureToggleProvider} from '../FeatureToggleProvider';
import {loggSidevisning} from '../utils/funksjonerForAmplitudeLogging';
import './App.css';
import {Innlogget, LoginContext, LoginProvider} from './LoginProvider';
import {NotifikasjonWidgetProvider} from '@navikt/arbeidsgiver-notifikasjon-widget';
import Saksoversikt from "./Hovedside/Sak/Saksoversikt/Saksoversikt";
import {SaksoversiktRestoreSession} from './Hovedside/Sak/Saksoversikt/SaksoversiktRestoreSession';
import {Alert, Link} from "@navikt/ds-react";
import {gittMiljo} from '../utils/environment';

const miljø = gittMiljo<"local" | "labs" | "dev" | "prod">({
    prod: 'prod',
    dev: 'dev',
    labs: 'labs',
    other: 'local',
});

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
                <NotifikasjonWidgetProvider miljo={miljø} apiUrl={`${basename}/notifikasjon-bruker-api`}>
                    <BrowserRouter basename={basename}>
                        <AmplitudeSidevisningEventLogger>
                            <Routes>
                                <Route
                                    path="/informasjon-om-tilgangsstyring"
                                    element={<InformasjonOmTilgangsstyringSide/>}
                                />
                                <Route
                                    path="*"
                                    element={
                                        <LoginBoundary>
                                            <FeatureToggleProvider>
                                                <AlertsProvider>
                                                    <OrganisasjonerOgTilgangerProvider>
                                                        <OrganisasjonsVelger>
                                                            <Routes>
                                                                <Route
                                                                    path="/bedriftsinformasjon"
                                                                    element={<InformasjonOmBedrift/>}/>
                                                                <Route
                                                                    path="/"
                                                                    element={<Hovedside/>}/>
                                                                <Route
                                                                    path="/saksoversikt"
                                                                    element={<Saksoversikt/>}/>
                                                                <Route
                                                                    path="/saksoversikt-restore-session"
                                                                    element={<SaksoversiktRestoreSession/>}/>
                                                                <Route
                                                                    path="*"
                                                                    element={
                                                                        <Alert style={{width:"calc(clamp(15rem, 50rem, 100vw - 2rem))" ,margin:"2rem auto"}} variant={"error"}>
                                                                            Finner ikke siden. <Link as={RouterLink} to={"/"}> Gå til Min side arbeidsgiver</Link>
                                                                        </Alert>}
                                                                />
                                                            </Routes>
                                                        </OrganisasjonsVelger>
                                                    </OrganisasjonerOgTilgangerProvider>
                                                </AlertsProvider>
                                            </FeatureToggleProvider>
                                        </LoginBoundary>
                                    }/>
                            </Routes>
                        </AmplitudeSidevisningEventLogger>
                    </BrowserRouter>
                </NotifikasjonWidgetProvider>
            </LoginProvider>
        </div>
    );
};

export default App;
