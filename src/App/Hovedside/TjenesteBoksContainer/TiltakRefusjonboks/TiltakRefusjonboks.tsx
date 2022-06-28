import React, {useContext} from 'react';
import {refosoURL} from '../../../../lenker';
import tiltakrefusjonikon from './tiltakrefusjonboks.svg';
import {StortTall, Tjenesteboks} from "../Tjenesteboks";
import {OrganisasjonsDetaljerContext} from "../../../OrganisasjonDetaljerProvider";



const TiltakRefusjonboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const url = valgtOrganisasjon.organisasjon.OrganizationNumber !== ''
        ? `${refosoURL}?bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
        : refosoURL;

    const klareForInnsending = valgtOrganisasjon.refusjonstatus["KLAR_FOR_INNSENDING"]

        return <Tjenesteboks
            ikon={tiltakrefusjonikon}
            href={url}
            tittel="Refusjon for sommerjobb"
            aria-label="Refusjon for sommerjobb. Søk og se refusjon for tilskudd til sommerjobb"
        >
            {klareForInnsending === undefined ? null : <>
                <StortTall>{klareForInnsending}</StortTall> refusjoner klare for innsending. <br/>
            </>}
            Søk og se refusjon for tilskudd til sommerjobb
        </Tjenesteboks>;
};

export default TiltakRefusjonboks;
