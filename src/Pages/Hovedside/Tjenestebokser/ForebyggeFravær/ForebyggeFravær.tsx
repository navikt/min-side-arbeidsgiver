import { lenkeTilForebyggefravar } from '../../../../lenker';
import React from 'react';
import ForebyggeFraværIkon from './ForebyggeFraværIkon.svg';
import './ForebyggeFravær.css';
import { useSykefravær } from './useSykefravær';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';

const ForebyggeFravR = () => {
    const valgtbedrift = () => {
        const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
        return orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`;
    };

    return (
        <Tjenesteboks
            ikon={ForebyggeFraværIkon}
            href={lenkeTilForebyggefravar + valgtbedrift()}
            tittel="Forebygge fravær"
            aria-label={beskrivelse}
        >
            <Beskrivelse />
        </Tjenesteboks>
    );
};

const beskrivelse = 'Verktøy for å forebygge fravær i din virksomhet.';

const Beskrivelse = () => {
    const statistikktype = (type: string) => {
        switch (type) {
            case 'NÆRING':
            case 'BRANSJE':
                return 'bransje';
            default:
                return 'bedrift';
        }
    };

    const sykefravær = useSykefravær();

    if (sykefravær !== undefined) {
        return (
            <span>
                <StortTall>{sykefravær.prosent.toString()} %</StortTall>
                <>
                    {' '}
                    legemeldt sykefravær i din {statistikktype(sykefravær.type)}. Lag en plan for å
                    redusere fraværet.{' '}
                </>
            </span>
        );
    }
    return <span>{beskrivelse}</span>;
};

export default ForebyggeFravR;
