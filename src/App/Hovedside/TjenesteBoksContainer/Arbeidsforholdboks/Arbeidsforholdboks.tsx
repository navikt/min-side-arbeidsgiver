import React, { useContext, useEffect, useState } from 'react';
import { innsynAaregURL } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import arbeidsforholdikon from './arbeidsforholdikon.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import { hentAntallArbeidsforholdFraAareg } from '../../../../api/arbeidsforholdApi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './ArbeidsforholdBoks.less';

const Arbeidsforholdboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState('–');
    useEffect(() => {
        if (valgtOrganisasjon)
            hentAntallArbeidsforholdFraAareg(valgtOrganisasjon.organisasjon.OrganizationNumber, valgtOrganisasjon.organisasjon.ParentOrganizationNumber).then(antallArbeidsforholdRespons =>
                antallArbeidsforholdRespons > 0 ? setAntallArbeidsforhold(antallArbeidsforholdRespons.toString()) : setAntallArbeidsforhold('–')
            );
    }, [valgtOrganisasjon]);
    const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
    const href = innsynAaregURL + (orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`);
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
                <span className={'topptekst'}> <span className={'antall-arbeidsforhold'}>{antallArbeidsforhold}</span> arbeidsforhold (aktive og avsluttede) </span>
                <div className={'bunntekst'}>Innrapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)
                </div>
            </LenkepanelMedLogging>
        </div>
    );
};

export default Arbeidsforholdboks;
