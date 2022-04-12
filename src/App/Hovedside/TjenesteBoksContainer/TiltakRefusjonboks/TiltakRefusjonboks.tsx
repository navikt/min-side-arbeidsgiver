import React from 'react';
import {refosoURL} from '../../../../lenker';
import tiltakrefusjonikon from './tiltakrefusjonboks.svg';
import {Tjenesteboks} from "../Tjenesteboks";

const TiltakRefusjonboks = () =>
    <Tjenesteboks
        ikon={tiltakrefusjonikon}
        href={refosoURL}
        tittel="Refusjon for sommerjobb"
        aria-label="Refusjon for sommerjobb. Søk og se refusjon for tilskudd til sommerjobb"
    >
        Søk og se refusjon for tilskudd til sommerjobb
    </Tjenesteboks>;


export default TiltakRefusjonboks;
