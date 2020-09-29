import React, { FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import { Organisasjon } from '../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import './HovedBanner.less';
import * as Record from '../../utils/Record';

interface OwnProps {
    sidetittel: string;
}

const Banner: FunctionComponent<RouteComponentProps & OwnProps> = ({history, sidetittel}) => {
    const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const { endreOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const onOrganisasjonChange = (organisasjon: Organisasjon) => {
        if (organisasjon.OrganizationNumber.length > 0 && !window.location.href.includes('/bedriftsinformasjon')) {
            history.replace("/?bedrift=" + organisasjon.OrganizationNumber);
        }
        endreOrganisasjon(organisasjon);
    };

    const orgs = Record.values(organisasjoner).map(_ => _.organisasjon)

    return (
        <Bedriftsmeny
            sidetittel={sidetittel}
            organisasjoner={orgs}
            onOrganisasjonChange={onOrganisasjonChange}
            history={history}
        />
    );
};

export default withRouter(Banner);
