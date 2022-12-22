import React, {FunctionComponent, useContext} from 'react';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import {OrganisasjonerOgTilgangerContext} from '../OrganisasjonerOgTilgangerProvider';
import * as Record from '../../utils/Record';
import {NotifikasjonWidget} from "@navikt/arbeidsgiver-notifikasjon-widget";
import amplitude from "../../utils/amplitude";
import { Organisasjon } from '../../altinn/organisasjon';

interface OwnProps {
    sidetittel: string;
    endreOrganisasjon: (org: Organisasjon) => void;
}

const Banner: FunctionComponent<OwnProps> = ({sidetittel, endreOrganisasjon}) => {
    const {organisasjoner} = useContext(OrganisasjonerOgTilgangerContext);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const orgs = organisasjoner ? Record.mapToArray(organisasjoner, (orgnr, {organisasjon}) => organisasjon) : [];
    return (
        <Bedriftsmeny
            sidetittel={sidetittel}
            undertittel={"INNLOGGEDE TJENESTER for arbeidsgiver"}
            organisasjoner={orgs}
            onOrganisasjonChange={endreOrganisasjon}
            amplitudeClient={amplitude}
        >
            <NotifikasjonWidget />
        </Bedriftsmeny>
    );
};

export default Banner;
