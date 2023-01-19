import React, {FunctionComponent, useContext, useEffect} from 'react';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import {OrganisasjonsDetaljerContext} from '../OrganisasjonDetaljerProvider';
import {OrganisasjonerOgTilgangerContext} from '../OrganisasjonerOgTilgangerProvider';
import * as Record from '../../utils/Record';
import {NotifikasjonWidget} from "@navikt/arbeidsgiver-notifikasjon-widget";
import amplitude from "../../utils/amplitude";
import {useLocation} from "react-router-dom";

interface OwnProps {
    sidetittel: string;
}

const Banner: FunctionComponent<OwnProps> = ({sidetittel}) => {
    const {organisasjoner} = useContext(OrganisasjonerOgTilgangerContext);
    const {endreOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const {pathname, search} = useLocation()
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const orgs = organisasjoner ? Record.mapToArray(organisasjoner, (orgnr, {organisasjon}) => organisasjon) : [];
    const valgtOrgnr = new URLSearchParams(search).get("bedrift")
    const valgtOrg = orgs.find(organisasjon => organisasjon.OrganizationNumber === valgtOrgnr)

    useEffect(()=>{
        if (pathname === '/saksoversikt' && valgtOrg){
            endreOrganisasjon(valgtOrg)
        }
    },[valgtOrg])

    return (
        <Bedriftsmeny
            sidetittel={sidetittel}
            undertittel={"INNLOGGEDE TJENESTER for arbeidsgiver"}
            organisasjoner={pathname === '/saksoversikt' ? [] : orgs}
            onOrganisasjonChange={endreOrganisasjon}
            amplitudeClient={amplitude}
        >
            <NotifikasjonWidget />
        </Bedriftsmeny>
    );
};

export default Banner;
