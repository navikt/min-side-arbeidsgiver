import React, { FunctionComponent, useContext, useEffect } from 'react';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import * as Record from '../../utils/Record';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import amplitude from '../../utils/amplitude';
import { useLocation } from 'react-router-dom';
import { setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';

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
            amplitudeClient={amplitude}
        >
            <NotifikasjonWidget />
        </Bedriftsmeny>
    );
};

export default Banner;
