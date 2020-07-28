import React, { FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { Organisasjon } from '../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import './HovedBanner.less';

interface OwnProps {
    sidetittel: string;
}

const Banner: FunctionComponent<RouteComponentProps & OwnProps> = ({history, sidetittel}) => {
    const { organisasjoner } = useContext(OrganisasjonsListeContext);
    const { endreOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (valgtOrganisasjon.OrganizationNumber.length > 0)
        history.replace("");
        if (organisasjon) {
            endreOrganisasjon(organisasjon);
        }
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
