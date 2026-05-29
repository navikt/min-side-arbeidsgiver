import React from 'react';
import tiltakrefusjonikon from './tiltak-refusjoner-kontrast.svg';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import './TiltakRefusjoner.css';

import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { gittMiljo } from '../../../../utils/environment';

const TiltakRefusjoner = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const tiltakRefusjonURL = gittMiljo({
        prod: 'https://tiltak-refusjon.nav.no/refusjon',
        other: 'https://tiltak-refusjon.intern.dev.nav.no/refusjon',
        demo: ' https://tiltak-refusjon-arbeidsgiver-labs.ekstern.dev.nav.no/refusjon',
    });
    const url =
        valgtOrganisasjon.organisasjon.orgnr !== ''
            ? `${tiltakRefusjonURL}?bedrift=${valgtOrganisasjon.organisasjon.orgnr}`
            : tiltakRefusjonURL;

    const klareForInnsending = valgtOrganisasjon.refusjonstatus['KLAR_FOR_INNSENDING'];

    const aria_label =
        klareForInnsending === undefined
            ? 'Søk og se refusjon for lønnstilskudd, sommerjobb, mentortilskudd og varig tilrettelagt arbeid'
            : `${klareForInnsending} refusjoner klare for innsending.` + ' Søk og se refusjon';

    return (
        <Tjenesteboks
            ikon={tiltakrefusjonikon}
            href={url}
            tittel="Refusjon for tiltak"
            aria-label={'Refusjon for tiltak, ' + aria_label}
        >
            <div>
                {klareForInnsending === undefined ? null : (
                    <>
                        <StortTall>{klareForInnsending}</StortTall> refusjoner klare for
                        innsending.{' '}
                    </>
                )}
                <div className="tiltak-refusjoner_bunntekst">
                    Søk og se refusjon for lønnstilskudd, sommerjobb, mentortilskudd og varig
                    tilrettelagt arbeid
                </div>
            </div>
        </Tjenesteboks>
    );
};

export default TiltakRefusjoner;
