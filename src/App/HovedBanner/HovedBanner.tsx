import React, { FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import EnkelVirksomhetsvelger from './EnkelVirksomhetsvelger/EnkelVirksomhetsvelger';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import './HovedBanner.less';
import { Organisasjon } from '../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';

const Banner: FunctionComponent<RouteComponentProps> = props => {
    const { history } = props;

    const { organisasjonstre, visNyMeny } = useContext(OrganisasjonsListeContext);
    const { endreOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        if (organisasjon) {
            endreOrganisasjon(organisasjon);
        }
    };

    return visNyMeny ? (
        <Bedriftsmeny
            sidetittel="Min side - arbeidsgiver"
            organisasjonstre={organisasjonstre}
            onOrganisasjonChange={onOrganisasjonChange}
            history={history}
        />
    ) : (
        <EnkelVirksomhetsvelger />
    );
};

export default withRouter(Banner);
