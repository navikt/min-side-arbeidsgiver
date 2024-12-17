import { lenkeTilForebyggefravar } from '../../../../lenker';
import React, { useContext } from 'react';
import ForebyggeFraværIkon from './ForebyggeFraværIkon.svg';
import { useSykefravær } from './useSykefravær';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

const ForebyggeFravR = () => {
    const valgtbedrift = () => {
        const orgnr =
            useContext(OrganisasjonsDetaljerContext).valgtOrganisasjon?.organisasjon
                .OrganizationNumber ?? '';

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
    const aria_label = sykefravær !== undefined ? `${sykefravær.prosent.toString()} % legemeldt sykefravær i din ${statistikktype(sykefravær.type)}. Lag en plan for å redusere fraværet.` : beskrivelse;

    return (
        <Tjenesteboks
            ikon={ForebyggeFraværIkon}
            href={lenkeTilForebyggefravar + valgtbedrift()}
            tittel="Forebygge fravær"
            aria-label={"Forebygge Fravær, " + aria_label}
        >
            {sykefravær !== undefined ? (
                <span>
                    <StortTall>{sykefravær.prosent.toString()} %</StortTall>
                    <>
                        {' '}
                        legemeldt sykefravær i din {statistikktype(sykefravær.type)}. Lag en plan
                        for å redusere fraværet.{' '}
                    </>
                </span>
            ) : (
                <span>{beskrivelse}</span>
            )}
        </Tjenesteboks>
    );
};

export default ForebyggeFravR;
