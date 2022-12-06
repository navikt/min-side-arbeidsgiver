import React, {useContext} from 'react';
import {syfoURL} from '../../../../lenker';
import syfoikon from './syfoikon.svg';
import {StortTall, Tjenesteboks} from "../Tjenesteboks";
import {OrganisasjonsDetaljerContext} from "../../../OrganisasjonDetaljerProvider";

const Syfoboks = () => {
    const {valgtOrganisasjon: {antallSykmeldte} = {antallSykmeldte: 0}} = useContext(OrganisasjonsDetaljerContext);
    return <Tjenesteboks
        ikon={syfoikon}
        href={syfoURL}
        tittel="Sykmeldte"
        aria-label="Se sykmeldte du har ansvar for å følge opp"
    >
        {
            antallSykmeldte == 0
                ? null
                : <>
                    <StortTall>{antallSykmeldte}</StortTall> {antallSykmeldte=== 1 ? 'sykmeldt' : 'sykmeldte'}
                </>
        }
        <p className="bunntekst">
            Se sykmeldte du har ansvar for å følge opp
        </p>
    </Tjenesteboks>;
};


export default Syfoboks
