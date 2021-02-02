import React from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { arbeidsforholdLink } from '../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import arbeidsforholdikon from './arbeidsforholdikon.svg';

const Arbeidsforholdboks = () => {
    const loggAtKlikketPaArbeidsfohold = () => {
        loggTjenesteTrykketPa('Arbeidsforhold', arbeidsforholdLink, 'Arbeidsforhold');
    };

    const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
    const href = arbeidsforholdLink + (orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`);
    return (
        <div className="arbeidsforholdboks tjenesteboks-innhold">
            <TjenesteBoksBanner
                tittel="Arbeidsforhold"
                imgsource={arbeidsforholdikon}
                altTekst=""
            />
            <Lenkepanel
                className="arbeidsforholdboks__arbeidsforhold"
                href={href}
                onClick={loggAtKlikketPaArbeidsfohold}
                tittelProps="normaltekst"
                aria-label="Arbeidsforhold. Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)"
            >
                Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret
                (Aa-registeret)
            </Lenkepanel>
        </div>
    );
};

export default Arbeidsforholdboks;
