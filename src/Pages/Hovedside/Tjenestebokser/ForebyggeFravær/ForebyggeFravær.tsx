import { lenkeTilForebyggefravar } from '../../../../lenker';
import React from 'react';
import ForebyggeFraværIkon from './forebygge-fravær-ikon-kontrast.svg';
import { useSykefravær } from './useSykefravær';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import './ForebyggeFravær.css'

import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

const ForebyggeFravR = () => {
    const valgtbedrift = () => {
        const orgnr = useOrganisasjonsDetaljerContext().valgtOrganisasjon.organisasjon.orgnr;

        return orgnr === '' ? '' : `?bedrift=${orgnr}`;
    };

    const sykefravær = useSykefravær();
    const statistikktype = (type: string) => {
        switch (type) {
            case 'NÆRING':
            case 'BRANSJE':
                return 'bransje';
            default:
                return 'bedrift';
        }
    };

    const beskrivelse = 'Verktøy for å forebygge fravær i din virksomhet.';
    const aria_label =
        sykefravær !== undefined
            ? `${sykefravær.prosent.toString()} % legemeldt sykefravær i din ${statistikktype(sykefravær.type)}. Lag en plan for å redusere fraværet.`
            : beskrivelse;

    return (
        <Tjenesteboks
            ikon={ForebyggeFraværIkon}
            href={lenkeTilForebyggefravar + valgtbedrift()}
            tittel="Forebygge fravær"
            aria-label={'Forebygge Fravær, ' + aria_label}
        >
            <div>
                {sykefravær !== undefined ? (
                    <>
                        <StortTall>{sykefravær.prosent.toString()} %</StortTall>
                        legemeldt sykefravær i din {statistikktype(sykefravær.type)}.
                        <div className='forebyggefravær_bunntekst'>Lag en plan for å redusere fraværet.</div>
                    </>
                ) : (
                    <span>{beskrivelse}</span>
                )}
            </div>
        </Tjenesteboks>
    );
};

export default ForebyggeFravR;
