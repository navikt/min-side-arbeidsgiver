import React, { useContext, useEffect, useState } from 'react';
import { innsynAaregURL } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import arbeidsforholdikon from './arbeidsforholdikon.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import { hentAntallArbeidsforholdFraAareg } from '../../../../api/arbeidsforholdApi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './ArbeidsforholdBoks.less';
import { EksperimentContext } from '../../../EksperimentProvider';

const Arbeidsforholdboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { visTall } = useContext(EksperimentContext);
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState('–');
    useEffect(() => {
        if (valgtOrganisasjon)
            hentAntallArbeidsforholdFraAareg(valgtOrganisasjon.organisasjon.OrganizationNumber, valgtOrganisasjon.organisasjon.ParentOrganizationNumber).then(antallArbeidsforholdRespons =>
                setAntallArbeidsforhold(antallArbeidsforholdRespons > 0 ? antallArbeidsforholdRespons.toString() : '–')
            );
    }, [valgtOrganisasjon]);
    const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
    const href = innsynAaregURL + (orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`);

    const TekstMedTall = () =>
        <>
            <span> <span className={'antall-arbeidsforhold'}>{antallArbeidsforhold}</span>arbeidsforhold (aktive og avsluttede) </span>
            <div className={'bunntekst'}> innrapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)
            </div>
        </>;

    const TekstUtenTall = () =>
        <>
            Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)
        </>;

    return (
        <div className='arbeidsforholdboks tjenesteboks-innhold'>
            <TjenesteBoksBanner
                tittel='Arbeidsforhold'
                imgsource={arbeidsforholdikon}
                altTekst=''
            />
            <LenkepanelMedLogging
                loggLenketekst='Arbeidsforhold'
                className='arbeidsforholdboks__arbeidsforhold'
                href={href}
                tittelProps='normaltekst'
                aria-label='Arbeidsforhold. Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)'
            >
                {visTall === true ? TekstMedTall() : TekstUtenTall()}
            </LenkepanelMedLogging>
        </div>
    );
};

export default Arbeidsforholdboks;
