import React from 'react';
import { innsynAaregURL } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import arbeidsforholdikon from './arbeidsforholdikon.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';

const Arbeidsforholdboks = () => {

    const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
    const href = innsynAaregURL + (orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`);
    return (
        <div className="arbeidsforholdboks tjenesteboks-innhold">
            <TjenesteBoksBanner
                tittel="Arbeidsforhold"
                imgsource={arbeidsforholdikon}
                altTekst=""
            />
            <LenkepanelMedLogging
                loggTjeneste="Arbeidsforhold"
                loggTekst="Arbeidsforhold"
                className="arbeidsforholdboks__arbeidsforhold"
                href={href}
                tittelProps="normaltekst"
                aria-label="Arbeidsforhold. Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)"
            >
                Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret
                (Aa-registeret)
            </LenkepanelMedLogging>
        </div>
    );
};

export default Arbeidsforholdboks;
