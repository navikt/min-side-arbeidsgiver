import * as React from 'react';
import {useContext} from 'react';
import {onBreadcrumbClick, setBreadcrumbs} from '@navikt/nav-dekoratoren-moduler';
import {OrganisasjonsDetaljerContext} from './OrganisasjonDetaljerProvider';
import {useNavigate} from "react-router-dom";

interface Brodsmule {
    url: string;
    title: string;
    handleInApp: boolean;
}

interface BrodsmuleProps {
    brodsmuler: Brodsmule[];
}

const Brodsmulesti = ({brodsmuler}: BrodsmuleProps) => {
    const navigate = useNavigate();
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);

    const orgnrdel = valgtOrganisasjon ? `?bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}` : '';

    onBreadcrumbClick(breadcrumb => {
        navigate(breadcrumb.url)
    });

    const defaultBrodsmule: Brodsmule[] = [
        {url: '/' + orgnrdel, title: 'Min side – arbeidsgiver', handleInApp: true}
    ];

    const breadcrumbs = defaultBrodsmule.concat(brodsmuler);

    setBreadcrumbs(breadcrumbs);

    return <></>;
};

export default Brodsmulesti;
