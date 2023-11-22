import React, { useContext } from 'react';
import { innsynAaregURL } from '../../../../lenker';
import arbeidsforholdikon from './arbeidsforhold-ikon.svg';
import { useAntallArbeidsforholdFraAareg } from './useAntallArbeidsforholdFraAareg';
import './Arbeidsforhold.css';
import { Tjenesteboks } from '../Tjenesteboks';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

const Arbeidsforhold = () => {
    const antallArbeidsforhold = useAntallArbeidsforholdFraAareg();

    const orgnr =
        useContext(OrganisasjonsDetaljerContext).valgtOrganisasjon?.organisasjon
            .OrganizationNumber ?? '';
    const href = innsynAaregURL + (orgnr === '' ? '' : `?bedrift=${orgnr}`);

    return (
        <Tjenesteboks
            ikon={arbeidsforholdikon}
            href={href}
            tittel="Arbeidsforhold"
            aria-label="Arbeidsforhold. Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)"
        >
            <div className="arbeidsforholdboks">
                <span>
                    {' '}
                    <span className="antall-arbeidsforhold">
                        {antallArbeidsforhold > 0 ? antallArbeidsforhold : '-'}
                    </span>
                    arbeidsforhold (aktive og avsluttede){' '}
                </span>
                <div className="bunntekst">
                    {' '}
                    innrapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)
                </div>
            </div>
        </Tjenesteboks>
    );
};

export default Arbeidsforhold;
