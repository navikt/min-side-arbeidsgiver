import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {BrowserRouter, Route, Link as RouterLink, Routes, useLocation} from 'react-router-dom';
import {basename} from '../paths';
import Hovedside from './Hovedside/Hovedside';
import LoginBoundary from './LoginBoundary';
import {AlertsProvider} from './Alerts/Alerts';
import {OrganisasjonerOgTilgangerProvider} from './OrganisasjonerOgTilgangerProvider';
import {OrganisasjonsDetaljerProvider} from './OrganisasjonDetaljerProvider';
import InformasjonOmTilgangsstyringSide from './InformasjonOmTilgangsstyringSide/InformasjonOmTilgangsstyringSide';
import InformasjonOmBedrift from './InformasjonOmBedrift/InformasjonOmBedrift';
import {FeatureToggleProvider} from '../FeatureToggleProvider';
import {ManglerTilgangContainer} from './Hovedside/ManglerTilgangContainer/ManglerTilgangContainer';
import {loggSidevisning} from '../utils/funksjonerForAmplitudeLogging';
import './App.css';
import {Innlogget, LoginContext, LoginProvider} from './LoginProvider';
import {NotifikasjonWidgetProvider} from '@navikt/arbeidsgiver-notifikasjon-widget';
import Banner from "./HovedBanner/HovedBanner";
import {Saksoversikt} from "./Hovedside/Sak/Saksoversikt/Saksoversikt";
import {SaksoversiktRestoreSession} from './Hovedside/Sak/Saksoversikt/SaksoversiktRestoreSession';
import {Alert, Link} from "@navikt/ds-react";
import {gittMiljo} from '../utils/environment';
import Brodsmulesti from "./Brodsmulesti/Brodsmulesti";

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

interface SideTittelProps {
    tittel: string,
    setTittel: (tittel: string) => void
}

const SideTittelWrapper: FunctionComponent<SideTittelProps> = props => {
    useEffect(() => {
        props.setTittel(props.tittel)
    })
    return <>{props.children}</>;
}

const App: FunctionComponent = () => {
    const [sidetittel, setSidetittel] = useState("")

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
                                                        <OrganisasjonsDetaljerProvider>
                                                            <Banner sidetittel={sidetittel}/>
                                                            <Routes>
                                                                <Route
                                                                    path="/bedriftsinformasjon"
                                                                    element={
                                                                        <SideTittelWrapper tittel={"Virksomhetsprofil"}
                                                                                           setTittel={setSidetittel}>
                                                                            <InformasjonOmBedrift/>
                                                                        </SideTittelWrapper>
                                                                    }/>
                                                                <Route
                                                                    path="/"
                                                                    element={
                                                                        <SideTittelWrapper
                                                                            tittel={"Min side – arbeidsgiver"}
                                                                            setTittel={setSidetittel}>
                                                                            <Hovedside/>
                                                                        </SideTittelWrapper>
                                                                    }/>
                                                                <Route
                                                                    path="/mangler-tilgang"
                                                                    element={
                                                                        <SideTittelWrapper
                                                                            tittel={"Min side – arbeidsgiver"}
                                                                            setTittel={setSidetittel}>
                                                                            <ManglerTilgangContainer/>
                                                                        </SideTittelWrapper>
                                                                    }/>
                                                                <Route
                                                                    path="/saksoversikt"
                                                                    element={
                                                                        <SideTittelWrapper tittel={"Saksoversikt"}
                                                                                           setTittel={setSidetittel}>
                                                                            <Brodsmulesti brodsmuler={[{url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true}]}/>
                                                                            <Saksoversikt/>
                                                                        </SideTittelWrapper>
                                                                    }/>
                                                                <Route
                                                                    path="/saksoversikt-restore-session"
                                                                    element={
                                                                        <SideTittelWrapper tittel={"Saksoversikt"}
                                                                                           setTittel={setSidetittel}>
                                                                            <SaksoversiktRestoreSession/>
                                                                        </SideTittelWrapper>
                                                                    }/>
                                                                <Route
                                                                    path="*"
                                                                    element={<Alert style={{width:"calc(clamp(15rem, 50rem, 100vw - 2rem))" ,margin:"2rem auto"}} variant={"error"}> Finner ikke siden. <Link as={RouterLink} to={"/"}> Gå til Min side arbeidsgiver</Link> </Alert>}
                                                                />
                                                            </Routes>
                                                        </OrganisasjonsDetaljerProvider>
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
