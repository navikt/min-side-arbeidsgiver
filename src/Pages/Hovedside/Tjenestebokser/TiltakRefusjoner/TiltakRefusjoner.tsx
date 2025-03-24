import React from 'react';
import { tiltakRefusjonURL } from '../../../../lenker';
import tiltakrefusjonikon from './tiltak-refusjoner-kontrast.svg';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import './TiltakRefusjoner.css';

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
            <div>
                {klareForInnsending === undefined ? null : (
                    <>
                        <StortTall>{klareForInnsending}</StortTall> refusjoner klare for
                        innsending.{' '}
                    </>
                )}
                <div className="tiltak-refusjoner_bunntekst">Søk og se refusjon</div>
            </div>
        </Tjenesteboks>
    );
};

export default TiltakRefusjoner;
