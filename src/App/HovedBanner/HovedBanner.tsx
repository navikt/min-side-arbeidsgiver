import React, { FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../OrganisasjonsListeProvider';
import { Organisasjon } from '../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import './HovedBanner.less';

interface OwnProps {
    sidetittel: string;
}

const Banner: FunctionComponent<RouteComponentProps & OwnProps> = ({history, sidetittel}) => {
    const { organisasjoner } = useContext(OrganisasjonsListeContext);
    const { endreOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const onOrganisasjonChange = (organisasjon: Organisasjon) => {
        if (organisasjon.OrganizationNumber.length > 0 && !window.location.href.includes('/bedriftsinformasjon')) {
            history.replace("/?bedrift=" + organisasjon!!.OrganizationNumber);
        }
        endreOrganisasjon(organisasjon);
    };

    return (
        <Bedriftsmeny
            sidetittel={sidetittel}
            organisasjoner={organisasjoner}
            onOrganisasjonChange={onOrganisasjonChange}
            history={history}
        />
    );
};

export default withRouter(Banner);
