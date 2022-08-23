import React, {useContext} from 'react';
import {syfoURL} from '../../../../lenker';
import syfoikon from './syfoikon.svg';
import {StortTall, Tjenesteboks} from "../Tjenesteboks";
import {OrganisasjonsDetaljerContext} from "../../../OrganisasjonDetaljerProvider";

const Syfoboks = () => {
    const {valgtOrganisasjon: {antallSykmeldinger} = {antallSykmeldinger: 0}} = useContext(OrganisasjonsDetaljerContext);
    return <Tjenesteboks
        ikon={syfoikon}
        href={syfoURL}
        tittel="Sykmeldte"
        aria-label="Sykmeldte. Se sykmeldte du har ansvar for å følge opp"
    >
        {
            antallSykmeldinger == 0
                ? <>Se sykmeldte du har ansvar for å følge opp</>
                : <><StortTall>{antallSykmeldinger}</StortTall> {antallSykmeldinger === 1 ? 'sykmelding' : 'sykmeldinger'} å følge opp</>
        }
    </Tjenesteboks>;
};


export default Syfoboks