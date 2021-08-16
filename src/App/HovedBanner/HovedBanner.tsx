import React, { FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import * as Record from '../../utils/Record';
import {inkluderNotifikasjonerFeatureToggle} from "../../FeatureToggleProvider";
import {NotifikasjonWidget} from "@navikt/arbeidsgiver-notifikasjon-widget";

interface OwnProps {
    sidetittel: string;
}

const Banner: FunctionComponent<RouteComponentProps & OwnProps> = ({history, sidetittel}) => {
    const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const { endreOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const orgs = organisasjoner ? Record.fold(organisasjoner, (orgnr, {organisasjon}) => organisasjon) : [];

    return (
        <Bedriftsmeny
            sidetittel={sidetittel}
            organisasjoner={orgs}
            onOrganisasjonChange={endreOrganisasjon}
            history={history}
        >
            { inkluderNotifikasjonerFeatureToggle ? <NotifikasjonWidget apiUri="/min-side-arbeidsgiver/notifikasjon/api/graphql" /> : null }
        </Bedriftsmeny>
    );
};

export default withRouter(Banner);
