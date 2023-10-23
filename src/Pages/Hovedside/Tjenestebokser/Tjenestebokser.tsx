import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Arbeidsforhold from './Arbeidsforhold/Arbeidsforhold';
import Sykmeldte from './Sykmeldte/Sykmeldte';
import Arbeidsplassen from './Arbeidsplassen/Arbeidsplassen';
import Kandidatlister from './Kandidatlister/Kandidatlister';
import TiltakAvtaler from './TiltakAvtaler/TiltakAvtaler';
import ForebyggeFravær from './ForebyggeFravær/ForebyggeFravær';
import TiltakRefusjoner from './TiltakRefusjoner/TiltakRefusjoner';
import './Tjenestebokser.css';

const Tjenestebokser: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const tjenester: FunctionComponent[] = [];

    if (valgtOrganisasjon.altinntilgang.arbeidsforhold) {
        tjenester.push(Arbeidsforhold);
    }

    if (valgtOrganisasjon.syfotilgang) {
        tjenester.push(Sykmeldte);
    }

    if (valgtOrganisasjon.reporteetilgang) {
        tjenester.push(ForebyggeFravær);
    }

    if (valgtOrganisasjon.altinntilgang.rekruttering) {
        tjenester.push(Kandidatlister);
        tjenester.push(Arbeidsplassen);
    }

    if (
        valgtOrganisasjon.altinntilgang.midlertidigLønnstilskudd ||
        valgtOrganisasjon.altinntilgang.varigLønnstilskudd ||
        valgtOrganisasjon.altinntilgang.arbeidstrening ||
        valgtOrganisasjon.altinntilgang.mentortilskudd ||
        valgtOrganisasjon.altinntilgang.inkluderingstilskudd
    ) {
        tjenester.push(TiltakAvtaler);
    }

    if (
        valgtOrganisasjon.altinntilgang.inntektsmelding &&
        valgtOrganisasjon.refusjonstatustilgang
    ) {
        tjenester.push(TiltakRefusjoner);
    }

    return (
        <div className={'tjenesteboks-container'}>
            {tjenester.map((Tjeneste, indeks) => (
                <Tjeneste key={indeks} />
            ))}
        </div>
    );
};

export default Tjenestebokser;
