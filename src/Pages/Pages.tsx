import React, { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import {
    BrowserRouter,
    Link as RouterLink,
    Navigate,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';
import Hovedside from './Hovedside/Hovedside';
import { LoginBoundary } from './LoginBoundary';
import { AlertsProvider } from './Alerts';
import { OrganisasjonerOgTilgangerProvider } from './OrganisasjonerOgTilgangerProvider';
import { OrganisasjonsDetaljerProvider } from './OrganisasjonsDetaljerProvider';
import OmVirksomheten from './OmVirksomheten/OmVirksomheten';
import { loggSidevisning } from '../utils/funksjonerForAmplitudeLogging';
import './Pages.css';
import { NotifikasjonWidgetProvider } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { Brodsmulesti, BannerMedBedriftsmeny, SaksoversiktBanner } from './Banner';
import { Saksoversikt } from './Saksoversikt/Saksoversikt';
import { Alert, Link } from '@navikt/ds-react';
import { gittMiljo } from '../utils/environment';
import { SWRConfig } from 'swr';
import { Saksside } from './Saksoversikt/Saksside';
import { SaksOversiktProvider } from './Saksoversikt/SaksoversiktProvider';

const miljø = gittMiljo<'local' | 'labs' | 'dev' | 'prod'>({
    prod: 'prod',
    dev: 'dev',
    demo: 'labs',
    other: 'local',
});

const AmplitudeSidevisningEventLogger: FunctionComponent<PropsWithChildren> = (props) => {
    const location = useLocation();

    useEffect(() => {
        loggSidevisning(location.pathname);
    }, [location.pathname]);

    return <>{props.children}</>;
};

const Pages: FunctionComponent = () => (
    <div className="typo-normal bakgrunnsside">
        <SWRConfig
            value={{
                revalidateOnFocus: false,
            }}
        >
            <LoginBoundary>
                <NotifikasjonWidgetProvider
                    miljo={miljø}
                    apiUrl={`${__BASE_PATH__}/notifikasjon-bruker-api`}
                >
                    <BrowserRouter basename={__BASE_PATH__}>
                        <AmplitudeSidevisningEventLogger>
                            <AlertsProvider>
                                <OrganisasjonerOgTilgangerProvider>
                                    <OrganisasjonsDetaljerProvider>
                                        <Routes>
                                            <Route
                                                path="/bedriftsinformasjon"
                                                element={
                                                    <>
                                                        <Brodsmulesti />
                                                        <BannerMedBedriftsmeny
                                                            sidetittel={'Om virksomheten'}
                                                        />
                                                        <OmVirksomheten />
                                                    </>
                                                }
                                            />
                                            <Route
                                                path="/"
                                                element={
                                                    <>
                                                        <BannerMedBedriftsmeny
                                                            sidetittel={'Min side – arbeidsgiver'}
                                                        />
                                                        <Hovedside />
                                                    </>
                                                }
                                            />
                                            <Route
                                                path="/saksoversikt"
                                                element={
                                                    <>
                                                        <Brodsmulesti />
                                                        <SaksoversiktBanner />
                                                        <SaksOversiktProvider>
                                                            <Saksoversikt />
                                                        </SaksOversiktProvider>
                                                    </>
                                                }
                                            />
                                            <Route
                                                path="/sak"
                                                element={
                                                    <>
                                                        <Brodsmulesti />
                                                        <SaksoversiktBanner />
                                                        <Saksside />
                                                    </>
                                                }
                                            />
                                            <Route
                                                path="/sak-restore-session"
                                                element={
                                                    <Navigate to="/saksoversikt" replace={true} />
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

export default Pages;
