import React from 'react';
import { refosoURL } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import tiltakrefusjonikon from './tiltakrefusjonboks.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';

const TiltakRefusjonboks = () => {
    return (
        <div className="tiltakrefusjonboks tjenesteboks-innhold">
            <TjenesteBoksBanner tittel="Refusjon for sommerjobb" imgsource={tiltakrefusjonikon} altTekst="" />
            <LenkepanelMedLogging
                loggLenketekst="Refusjon for sommerjobb"
                className="TiltakRefusjonboks__refusjonforsommerjobb"
                href={refosoURL}
                tittelProps="normaltekst"
                aria-label="Refusjon for sommerjobb. Søk og se refusjon for tilskudd til sommerjobb"
            >
                Søk og se refusjon for tilskudd til sommerjobb
            </LenkepanelMedLogging>
        </div>
    );
};

export default TiltakRefusjonboks;
