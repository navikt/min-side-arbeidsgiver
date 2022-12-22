import React, {useContext, useEffect, useState} from 'react';
import {innsynAaregURL} from '../../../../lenker';
import arbeidsforholdikon from './arbeidsforholdikon.svg';
import {hentAntallArbeidsforholdFraAareg} from '../../../../api/arbeidsforholdApi';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import './ArbeidsforholdBoks.css';
import {Tjenesteboks} from "../Tjenesteboks";

const Arbeidsforholdboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState('–');
    useEffect(() => {
        hentAntallArbeidsforholdFraAareg(valgtOrganisasjon.organisasjon.OrganizationNumber, valgtOrganisasjon.organisasjon.ParentOrganizationNumber ?? '').then(antallArbeidsforholdRespons =>
            setAntallArbeidsforhold(antallArbeidsforholdRespons > 0 ? antallArbeidsforholdRespons.toString() : '–')
        );
    }, [valgtOrganisasjon]);
    const href = `${innsynAaregURL}?bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`;

    return <Tjenesteboks
        ikon={arbeidsforholdikon}
        href={href}
        tittel='Arbeidsforhold'
        aria-label='Arbeidsforhold. Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)'
    >
        <div className='arbeidsforholdboks'>
            <span> <span className='antall-arbeidsforhold'>{antallArbeidsforhold}</span>arbeidsforhold (aktive og avsluttede) </span>
            <div className='bunntekst'> innrapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)
            </div>
        </div>
    </Tjenesteboks>;
};

export default Arbeidsforholdboks;
