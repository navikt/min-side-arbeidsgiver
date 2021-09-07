import React from 'react';
import { syfoURL } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import syfoikon from './syfoikon.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';

const Syfoboks = () => {
    return (
        <div className="syfoboks tjenesteboks-innhold">
            <TjenesteBoksBanner tittel="Sykmeldte" imgsource={syfoikon} altTekst="" />
            <LenkepanelMedLogging
                loggTjeneste="Syfo"
                loggTekst="Sykmeldte"
                className="syfoboks__sykemeldte"
                href={syfoURL}
                tittelProps="normaltekst"
                aria-label="Sykmeldte. Se sykmeldte du har ansvar for å følge opp"
            >
                Se sykmeldte du har ansvar for å følge opp
            </LenkepanelMedLogging>
        </div>
    );
};

export default Syfoboks;
