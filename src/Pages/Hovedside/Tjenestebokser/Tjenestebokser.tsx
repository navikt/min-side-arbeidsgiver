import React, { FunctionComponent } from 'react';
import Arbeidsforhold from './Arbeidsforhold/Arbeidsforhold';
import Sykmeldte from './Sykmeldte/Sykmeldte';
import Stillingsannonser from './Arbeidsplassen/ArbeidsplassenStillingsannonser';
import Kandidatlister from './Kandidatlister/Kandidatlister';
import TiltakAvtaler from './TiltakAvtaler/TiltakAvtaler';
import ForebyggeFravær from './ForebyggeFravær/ForebyggeFravær';
import TiltakRefusjoner from './TiltakRefusjoner/TiltakRefusjoner';
import './Tjenestebokser.css';
import { useOrganisasjonsDetaljerContext } from '../../OrganisasjonsDetaljerContext';

type TjenesteBoks =
    | typeof Arbeidsforhold
    | typeof Sykmeldte
    | typeof ForebyggeFravær
    | typeof Kandidatlister
    | typeof Stillingsannonser
    | typeof TiltakAvtaler
    | typeof TiltakRefusjoner;

const TjenesteboksContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

    const tjenester: TjenesteBoks[] = [];

    if (valgtOrganisasjon.altinntilgang.arbeidsforhold) {
        tjenester.push(Arbeidsforhold);
    }

    if (valgtOrganisasjon.syfotilgang) {
        tjenester.push(Sykmeldte);
    }

    if (valgtOrganisasjon.vilkaarligAltinntilgang) {
        tjenester.push(ForebyggeFravær);
    }

    if (valgtOrganisasjon.altinntilgang.rekrutteringStillingsannonser) {
        tjenester.push(Stillingsannonser);
    }

    if (valgtOrganisasjon.altinntilgang.rekrutteringKandidater) {
        tjenester.push(Kandidatlister);
    }

    if (
        valgtOrganisasjon.altinntilgang.midlertidigLønnstilskudd ||
        valgtOrganisasjon.altinntilgang.varigLønnstilskudd ||
        valgtOrganisasjon.altinntilgang.varigTilrettelagtArbeid ||
        valgtOrganisasjon.altinntilgang.arbeidstrening ||
        valgtOrganisasjon.altinntilgang.mentortilskudd ||
        valgtOrganisasjon.altinntilgang.inkluderingstilskudd
    ) {
        tjenester.push(TiltakAvtaler);
    }

    if (
        valgtOrganisasjon.altinntilgang.tiltaksrefusjon &&
        valgtOrganisasjon.refusjonstatustilgang
    ) {
        tjenester.push(TiltakRefusjoner);
    }

    return (
        <div className={'tjenesteboks-container'}>
            <Tjenestebokser tjenester={tjenester} />
        </div>
    );
};

const Tjenestebokser: FunctionComponent<{ tjenester: TjenesteBoks[] }> = ({ tjenester }) => {
    const tjenestebokser = tjenester.map((tjeneste) => ({
        tjeneste,
        Boks: tjeneste,
    }));

    return (
        <>
            {tjenestebokser.map(({ tjeneste, Boks }) => (
                <Boks key={tjeneste.name} />
            ))}
        </>
    );
};

export default TjenesteboksContainer;
