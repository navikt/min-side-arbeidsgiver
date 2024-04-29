import React, { FunctionComponent, useContext, useEffect } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Arbeidsforhold from './Arbeidsforhold/Arbeidsforhold';
import Sykmeldte from './Sykmeldte/Sykmeldte';
import Arbeidsplassen from './Arbeidsplassen/Arbeidsplassen';
import Kandidatlister from './Kandidatlister/Kandidatlister';
import TiltakAvtaler from './TiltakAvtaler/TiltakAvtaler';
import ForebyggeFravær from './ForebyggeFravær/ForebyggeFravær';
import TiltakRefusjoner from './TiltakRefusjoner/TiltakRefusjoner';
import './Tjenestebokser.css';
import amplitude from '../../../utils/amplitude';

const Bokser = {
    Arbeidsforhold: Arbeidsforhold,
    Sykmeldte: Sykmeldte,
    ForebyggeFravær: ForebyggeFravær,
    Kandidatlister: Kandidatlister,
    Arbeidsplassen: Arbeidsplassen,
    TiltakAvtaler: TiltakAvtaler,
    TiltakRefusjoner: TiltakRefusjoner,
};
type TjenesteBoks = keyof typeof Bokser;

const TjenesteboksContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const tjenester: TjenesteBoks[] = [];

    if (valgtOrganisasjon.altinntilgang.arbeidsforhold) {
        tjenester.push('Arbeidsforhold');
    }

    if (valgtOrganisasjon.syfotilgang) {
        tjenester.push('Sykmeldte');
    }

    if (valgtOrganisasjon.reporteetilgang) {
        tjenester.push('ForebyggeFravær');
    }

    if (valgtOrganisasjon.altinntilgang.rekruttering) {
        tjenester.push('Kandidatlister');
        tjenester.push('Arbeidsplassen');
    }

    if (
        valgtOrganisasjon.altinntilgang.midlertidigLønnstilskudd ||
        valgtOrganisasjon.altinntilgang.varigLønnstilskudd ||
        valgtOrganisasjon.altinntilgang.arbeidstrening ||
        valgtOrganisasjon.altinntilgang.mentortilskudd ||
        valgtOrganisasjon.altinntilgang.inkluderingstilskudd
    ) {
        tjenester.push('TiltakAvtaler');
    }

    if (
        valgtOrganisasjon.altinntilgang.inntektsmelding &&
        valgtOrganisasjon.refusjonstatustilgang
    ) {
        tjenester.push('TiltakRefusjoner');
    }

    return (
        <div className={'tjenesteboks-container'}>
            <Tjenestebokser tjenester={tjenester} />
        </div>
    );
};

const Tjenestebokser: FunctionComponent<{ tjenester: TjenesteBoks[] }> = ({ tjenester }) => {
    useEffect(() => {
        amplitude.logEvent('komponent-lastet', {
            komponent: 'tjenestebokser',
            tjenester: tjenester.toSorted(),
        });
    }, []);

    const tjenestebokser = tjenester.map((tjeneste) => ({
        tjeneste,
        Boks: Bokser[tjeneste],
    }));

    return (
        <div className={'tjenesteboks-container'}>
            {tjenestebokser.map(({ tjeneste, Boks }) => (
                <Boks key={tjeneste} />
            ))}
        </div>
    );
};

export default TjenesteboksContainer;
