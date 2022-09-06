import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Arbeidsforholdboks from './Arbeidsforholdboks/Arbeidsforholdboks';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Tiltakboks from './Tiltakboks/Tiltakboks';
import IAwebboks from './IAwebboks/IAwebboks';
import TiltakRefusjonboks from './TiltakRefusjonboks/TiltakRefusjonboks';
import './TjenesteBoksContainer.css';

const TjenesteBoksContainer: FunctionComponent = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) {
        return null;
    }

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

    let antallClassname;
    if (tjenester.length === 1) {
        antallClassname = 'antall-en';
    } else if (tjenester.length % 2 === 0) {
        antallClassname = 'antall-partall';
    } else {
        antallClassname = 'antall-oddetall';
    }

    return (
        <div className={'tjenesteboks-container ' + antallClassname}>
            {tjenester.map((Tjeneste, indeks) =>
                <div className='tjenesteboks' key={indeks}>
                    <Tjeneste />
                </div>
            )}
        </div>
    );
};

export default TjenesteBoksContainer;
