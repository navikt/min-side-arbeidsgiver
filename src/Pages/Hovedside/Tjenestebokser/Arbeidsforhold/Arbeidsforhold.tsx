import React from 'react';
import arbeidsforholdikon from './arbeidsforhold-ikon-kontrast.svg';
import { useAntallArbeidsforholdFraAareg } from './useAntallArbeidsforholdFraAareg';
import './Arbeidsforhold.css';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';

import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { gittMiljo } from '../../../../utils/environment';

const Arbeidsforhold = () => {
    const antallArbeidsforhold = useAntallArbeidsforholdFraAareg();

    const orgnr = useOrganisasjonsDetaljerContext().valgtOrganisasjon.organisasjon.orgnr;
    const href =
        gittMiljo({
            prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/',
            demo: 'https://arbeidsforhold.ansatt.dev.nav.no/arbeidsforhold/',
            other: 'https://arbeidsforhold.intern.dev.nav.no/arbeidsforhold/',
        }) + (orgnr === '' ? '' : `?bedrift=${orgnr}`);

    return (
        <Tjenesteboks
            ikon={arbeidsforholdikon}
            href={href}
            tittel="Arbeidsforhold"
            aria-label={`Arbeidsforhold, ${antallArbeidsforhold > 0 ? antallArbeidsforhold : 'Ingen'} arbeidsforhold (aktive og avsluttede). Se arbeidsforhold rapportert til Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret)`}
        >
            <div>
                <span>
                    {' '}
                    <StortTall>{antallArbeidsforhold > 0 ? antallArbeidsforhold : '-'}</StortTall>
                    arbeidsforhold (aktive og avsluttede){' '}
                </span>
                <div className="arbeidsforholdboks_bunntekst">Innrapportert til Aa-registret</div>
            </div>
        </Tjenesteboks>
    );
};

export default Arbeidsforhold;
