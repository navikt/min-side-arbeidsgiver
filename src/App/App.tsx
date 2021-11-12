import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch, useLocation} from 'react-router-dom';
import {basename} from '../paths';
import Hovedside from './Hovedside/Hovedside';
import LoginBoundary from './LoginBoundary';
import {OrganisasjonerOgTilgangerProvider} from './OrganisasjonerOgTilgangerProvider';
import {OrganisasjonsDetaljerProvider} from './OrganisasjonDetaljerProvider';
import InformasjonOmTilgangsstyringSide from './InformasjonOmTilgangsstyringSide/InformasjonOmTilgangsstyringSide';
import InformasjonOmBedrift from './InformasjonOmBedrift/InformasjonOmBedrift';
import {FeatureToggleProvider} from '../FeatureToggleProvider';
import {ManglerTilgangContainer} from './Hovedside/ManglerTilgangContainer/ManglerTilgangContainer';
import {loggSidevisning} from '../utils/funksjonerForAmplitudeLogging';
import './App.less';
import {Innlogget, LoginContext, LoginProvider} from './LoginProvider';
import Banner from "./HovedBanner/HovedBanner";

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
                                            <Banner sidetittel={sidetittel}/>
                                            <Switch>
                                                <Route path="/bedriftsinformasjon" exact={true}>
                                                    <SideTittelWrapper tittel={"Virksomhetsprofil"}
                                                                       setTittel={setSidetittel}>
                                                        <InformasjonOmBedrift/>
                                                    </SideTittelWrapper>
                                                </Route>
                                                <Route path="/" exact={true}>
                                                    <SideTittelWrapper tittel={"Min side – arbeidsgiver"}
                                                                       setTittel={setSidetittel}>
                                                        <Hovedside/>
                                                    </SideTittelWrapper>
                                                </Route>
                                                <Route path="/mangler-tilgang" exact={true}>
                                                    <SideTittelWrapper tittel={"Min side – arbeidsgiver"}
                                                                       setTittel={setSidetittel}>
                                                        <ManglerTilgangContainer/>
                                                    </SideTittelWrapper>
                                                </Route>
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
