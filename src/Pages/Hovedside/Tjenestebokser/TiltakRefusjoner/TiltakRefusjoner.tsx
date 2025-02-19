import React from 'react';
import { tiltakRefusjonURL } from '../../../../lenker';
import tiltakrefusjonikon from './TiltakRefusjoner.svg';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';

import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

const TiltakRefusjoner = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

    const url =
        valgtOrganisasjon.organisasjon.orgnr !== ''
            ? `${tiltakRefusjonURL}?bedrift=${valgtOrganisasjon.organisasjon.orgnr}`
            : tiltakRefusjonURL;

    const klareForInnsending = valgtOrganisasjon.refusjonstatus['KLAR_FOR_INNSENDING'];

    const aria_label =
        klareForInnsending === undefined
            ? 'Søk og se refusjon for lønnstilskudd og sommerjobb'
            : `${klareForInnsending} refusjoner klare for innsending.` + ' Søk og se refusjon';

    return (
        <Tjenesteboks
            ikon={tiltakrefusjonikon}
            href={url}
            tittel="Refusjon for lønnstilskudd og sommerjobb"
            aria-label={'Refusjon for lønnstilskudd og sommerjobb, ' + aria_label}
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

export default TiltakRefusjoner;
