import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Link as RouterLink, Routes, useLocation } from 'react-router-dom';
import { basename } from '../paths';
import Hovedside from './Hovedside/Hovedside';
import { LoginBoundary } from './LoginBoundary';
import { AlertsProvider } from './Alerts/Alerts';
import { OrganisasjonerOgTilgangerProvider } from './OrganisasjonerOgTilgangerProvider';
import { OrganisasjonsDetaljerProvider } from './OrganisasjonDetaljerProvider';
import InformasjonOmBedrift from './InformasjonOmBedrift/InformasjonOmBedrift';
import { IngenTilganger } from './IngenTilganger/IngenTilganger';
import { loggSidevisning } from '../utils/funksjonerForAmplitudeLogging';
import './App.css';
import { NotifikasjonWidgetProvider } from '@navikt/arbeidsgiver-notifikasjon-widget';
import Banner from './HovedBanner/HovedBanner';
import { Saksoversikt } from './Hovedside/Sak/Saksoversikt/Saksoversikt';
import { SaksoversiktRestoreSession } from './Hovedside/Sak/Saksoversikt/SaksoversiktRestoreSession';
import { Alert, Link } from '@navikt/ds-react';
import { gittMiljo } from '../utils/environment';
import Brodsmulesti from './Brodsmulesti/Brodsmulesti';
import { SWRConfig } from 'swr';

const miljø = gittMiljo<'local' | 'labs' | 'dev' | 'prod'>({
    prod: 'prod',
    dev: 'dev',
    demo: 'labs',
    other: 'local',
});

const AmplitudeSidevisningEventLogger: FunctionComponent = (props) => {
    const location = useLocation();

    useEffect(() => {
        loggSidevisning(location.pathname);
    }, [location.pathname]);

    return <>{props.children}</>;
};

interface SideTittelProps {
    tittel: string;
    setTittel: (tittel: string) => void;
}

const SideTittelWrapper: FunctionComponent<SideTittelProps> = (props) => {
    useEffect(() => {
        props.setTittel(props.tittel);
    });
    return <>{props.children}</>;
};

const App: FunctionComponent = () => {
    const [sidetittel, setSidetittel] = useState('');

    return (
        <div className="typo-normal bakgrunnsside">
            <SWRConfig
                value={{
                    revalidateOnFocus: false,
                }}
            >
                <LoginBoundary>
                    <NotifikasjonWidgetProvider
                        miljo={miljø}
                        apiUrl={`${basename}/notifikasjon-bruker-api`}
                    >
                        <BrowserRouter basename={basename}>
                            <AmplitudeSidevisningEventLogger>
                                <AlertsProvider>
                                    <OrganisasjonerOgTilgangerProvider>
                                        <OrganisasjonsDetaljerProvider>
                                            <Banner sidetittel={sidetittel} />
                                            <Routes>
                                                <Route
                                                    path="/bedriftsinformasjon"
                                                    element={
                                                        <SideTittelWrapper
                                                            tittel={'Om virksomheten'}
                                                            setTittel={setSidetittel}
                                                        >
                                                            <InformasjonOmBedrift />
                                                        </SideTittelWrapper>
                                                    }
                                                />
                                                <Route
                                                    path="/"
                                                    element={
                                                        <SideTittelWrapper
                                                            tittel={'Min side – arbeidsgiver'}
                                                            setTittel={setSidetittel}
                                                        >
                                                            <Hovedside />
                                                        </SideTittelWrapper>
                                                    }
                                                />
                                                <Route
                                                    path="/saksoversikt"
                                                    element={
                                                        <SideTittelWrapper
                                                            tittel={'Saksoversikt'}
                                                            setTittel={setSidetittel}
                                                        >
                                                            <Brodsmulesti
                                                                brodsmuler={[
                                                                    {
                                                                        url: '/saksoversikt',
                                                                        title: 'Saksoversikt',
                                                                        handleInApp: true,
                                                                    },
                                                                ]}
                                                            />
                                                            <Saksoversikt />
                                                        </SideTittelWrapper>
                                                    }
                                                />
                                                <Route
                                                    path="/sak-restore-session"
                                                    element={
                                                        <SideTittelWrapper
                                                            tittel={'Saksoversikt'}
                                                            setTittel={setSidetittel}
                                                        >
                                                            <SaksoversiktRestoreSession />
                                                        </SideTittelWrapper>
                                                    }
                                                />
                                                <Route
                                                    path="*"
                                                    element={
                                                        <Alert
                                                            className={'app-finner-ikke-siden'}
                                                            variant={'error'}
                                                        >
                                                            Finner ikke siden.{' '}
                                                            <Link as={RouterLink} to={'/'}>
                                                                Gå til Min side arbeidsgiver
                                                            </Link>
                                                        </Alert>
                                                    }
                                                />
                                            </Routes>
                                        </OrganisasjonsDetaljerProvider>
                                    </OrganisasjonerOgTilgangerProvider>
                                </AlertsProvider>
                            </AmplitudeSidevisningEventLogger>
                        </BrowserRouter>
                    </NotifikasjonWidgetProvider>
                </LoginBoundary>
            </SWRConfig>
        </div>
    );
};

export default App;
