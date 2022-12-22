import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Arbeidsforholdboks from './Arbeidsforholdboks/Arbeidsforholdboks';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Tiltakboks from './Tiltakboks/Tiltakboks';
import IAwebboks from './IAwebboks/IAwebboks';
import TiltakRefusjonboks from './TiltakRefusjonboks/TiltakRefusjonboks';
import './TjenesteBoksContainer.css';

const TjenesteBoksContainer: FunctionComponent = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);

    const tjenester: FunctionComponent[] = [];

    if (valgtOrganisasjon.altinntilgang.arbeidsforhold) {
        tjenester.push(Arbeidsforholdboks);
    }

    if (valgtOrganisasjon.syfotilgang) {
        tjenester.push(Syfoboks);
    }

    if (valgtOrganisasjon.altinntilgang.iaweb) {
        tjenester.push(IAwebboks);
    }

    if (valgtOrganisasjon.altinntilgang.pam) {
        tjenester.push(Pamboks);
    }

    if (valgtOrganisasjon.altinntilgang.midlertidigLønnstilskudd
        || valgtOrganisasjon.altinntilgang.varigLønnstilskudd
        || valgtOrganisasjon.altinntilgang.arbeidstrening
        || valgtOrganisasjon.altinntilgang.mentortilskudd
        || valgtOrganisasjon.altinntilgang.inkluderingstilskudd
    ) {
        tjenester.push(Tiltakboks);
    }

    if (valgtOrganisasjon.altinntilgang.inntektsmelding && valgtOrganisasjon.refusjonstatustilgang) {
        tjenester.push(TiltakRefusjonboks);
    }

    return (
        <div className={'tjenesteboks-container'}>
            {tjenester.map((Tjeneste, indeks) =>
                <div className='tjenesteboks' key={indeks}>
                    <Tjeneste />
                </div>
            )}
        </div>
    );
};

export default TjenesteBoksContainer;
