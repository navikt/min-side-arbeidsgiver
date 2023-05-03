import React from 'react';
import {innsynAaregURL} from '../../../../lenker';
import arbeidsforholdikon from './arbeidsforholdikon.svg';
import './ArbeidsforholdBoks.css';
import {Tjenesteboks} from "../Tjenesteboks";

const Arbeidsforholdboks = () => {
    const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
    const href = innsynAaregURL + (orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`);

    return <Tjenesteboks
        ikon={arbeidsforholdikon}
        href={href}
        tittel='Arbeidsforhold'
        aria-label='Arbeidsforhold. Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)'
    >
        <div className='arbeidsforholdboks'>
            <span> Arbeidsforhold (aktive og avsluttede) </span>
            <div className='bunntekst'> innrapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)
            </div>
        </div>
    </Tjenesteboks>;
};

export default Arbeidsforholdboks;
