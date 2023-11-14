import React, { FunctionComponent, useContext, useEffect } from 'react';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { OrganisasjonsDetaljerContext } from './OrganisasjonDetaljerProvider';
import { OrganisasjonerOgTilgangerContext } from './OrganisasjonerOgTilgangerProvider';
import * as Record from '../utils/Record';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { useLocation, useNavigate } from 'react-router-dom';
import { onBreadcrumbClick, setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';
import { Loader } from '@navikt/ds-react';

interface OwnProps {
    sidetittel?: string;
}

export const SimpleBanner: FunctionComponent<OwnProps> = ({
    sidetittel = 'Min side – arbeidsgiver',
}) => {
    useEffect(() => {
        setBreadcrumbs([
            {
                url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver',
                title: 'Min side – arbeidsgiver',
            },
        ]).then(() => {});
    }, []);
    return (
        <Bedriftsmeny
            sidetittel={sidetittel}
            undertittel={'INNLOGGEDE TJENESTER for arbeidsgiver'}
        />
    );
};

const Banner: FunctionComponent<OwnProps> = ({ sidetittel }) => {
    const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const { endreOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { pathname } = useLocation();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const orgs = organisasjoner
        ? Record.mapToArray(organisasjoner, (orgnr, { organisasjon }) => organisasjon)
        : [];

    return (
        <Bedriftsmeny
            sidetittel={sidetittel}
            undertittel={'INNLOGGEDE TJENESTER for arbeidsgiver'}
            organisasjoner={pathname === '/saksoversikt' ? [] : orgs}
            onOrganisasjonChange={endreOrganisasjon}
        >
            <NotifikasjonWidget />
        </Bedriftsmeny>
    );
};

interface Brodsmule {
    url: string;
    title: string;
    handleInApp: boolean;
}

interface BrodsmuleProps {
    brodsmuler: Brodsmule[];
}

export const Brodsmulesti = ({ brodsmuler }: BrodsmuleProps) => {
    const navigate = useNavigate();
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const orgnrdel = valgtOrganisasjon
        ? `?bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
        : '';

    onBreadcrumbClick((breadcrumb) => {
        navigate(breadcrumb.url);
    });

    const defaultBrodsmule: Brodsmule[] = [
        { url: '/' + orgnrdel, title: 'Min side – arbeidsgiver', handleInApp: true },
    ];

    const breadcrumbs = defaultBrodsmule.concat(brodsmuler);

    useEffect(() => {
        setBreadcrumbs(breadcrumbs);
    }, [JSON.stringify(brodsmuler)]);

    return <></>;
};

export const Spinner = () => (
    <div className="app-laster-spinner">
        <Loader size="3xlarge" />
    </div>
);

export const SpinnerMedBanner = () => {
    return (
        <>
            <SimpleBanner />
            <Spinner />
        </>
    );
};

export default Banner;