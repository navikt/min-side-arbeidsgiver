import React, { useContext } from 'react';
import { refosoURL } from '../../../../lenker';
import tiltakrefusjonikon from './tiltakrefusjonboks.svg';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

const TiltakRefusjonboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const url =
        valgtOrganisasjon.organisasjon.OrganizationNumber !== ''
            ? `${refosoURL}?bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
            : refosoURL;

    const klareForInnsending = valgtOrganisasjon.refusjonstatus['KLAR_FOR_INNSENDING'];

    return (
        <Tjenesteboks
            ikon={tiltakrefusjonikon}
            href={url}
            tittel="Refusjon for lønnstilskudd og sommerjobb"
            aria-label="Refusjon for lønnstilskudd og sommerjobb. Søk og se refusjon for lønnstilskudd og sommerjobb"
        >
            {klareForInnsending === undefined ? null : (
                <>
                    <StortTall>{klareForInnsending}</StortTall> refusjoner klare for innsending.{' '}
                    <br />
                </>
            )}
            Søk og se refusjon
        </Tjenesteboks>
    );
};

export default TiltakRefusjonboks;
