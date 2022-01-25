import React, { FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import * as Record from '../../utils/Record';
import {NotifikasjonWidget} from "@navikt/arbeidsgiver-notifikasjon-widget";
import amplitude from "../../utils/amplitude";

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
            amplitudeClient={amplitude}
        >
            <NotifikasjonWidget />
        </Bedriftsmeny>
    );
};

export default withRouter(Banner);
