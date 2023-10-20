import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Arbeidsforholdboks from './Arbeidsforholdboks/Arbeidsforholdboks';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Kandidatlisteboks from "./Kandidatlisteboks/Kandidatlisteboks";
import Tiltakboks from './Tiltakboks/Tiltakboks';
import ForebyggeFraværboks from './ForebyggeFraværboks/ForebyggeFraværboks';
import TiltakRefusjonboks from './TiltakRefusjonboks/TiltakRefusjonboks';
import './Tjenestebokser.css';

const Tjenestebokser: FunctionComponent = () => {
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

    if (valgtOrganisasjon.reporteetilgang) {
        tjenester.push(ForebyggeFraværboks);
    }

    if (valgtOrganisasjon.altinntilgang.rekruttering) {
        tjenester.push(Kandidatlisteboks);
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
                <Tjeneste key={indeks} />
            )}
        </div>
    );
};

export default Tjenestebokser;
