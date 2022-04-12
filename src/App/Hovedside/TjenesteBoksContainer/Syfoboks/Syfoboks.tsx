import React from 'react';
import {syfoURL} from '../../../../lenker';
import syfoikon from './syfoikon.svg';
import {Tjenesteboks} from "../Tjenesteboks";

const Syfoboks = () =>
    <Tjenesteboks
        ikon={syfoikon}
        href={syfoURL}
        tittel="Sykmeldte"
        aria-label="Sykmeldte. Se sykmeldte du har ansvar for å følge opp"
    >
        Se sykmeldte du har ansvar for å følge opp
    </Tjenesteboks>;


export default Syfoboks