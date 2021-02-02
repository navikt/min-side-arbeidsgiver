import React from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { syfoLink } from '../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import syfoikon from './syfoikon.svg';

const Syfoboks = () => {
    return (
        <div className="syfoboks tjenesteboks-innhold">
            <TjenesteBoksBanner tittel="Sykmeldte" imgsource={syfoikon} altTekst="" />
            <Lenkepanel
                className="syfoboks__sykemeldte"
                href={syfoLink}
                onClick={() => loggTjenesteTrykketPa('Syfo', syfoLink, 'Sykmeldte')}
                tittelProps="normaltekst"
                aria-label="Sykmeldte. Se sykmeldte du har ansvar for å følge opp"
            >
                Se sykmeldte du har ansvar for å følge opp
            </Lenkepanel>
        </div>
    );
};

export default Syfoboks;
