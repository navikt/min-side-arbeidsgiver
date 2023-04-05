import {lenkeTilForebyggefravar} from '../../../../lenker';
import React, { useContext, useEffect, useState } from 'react';
import * as Sentry from "@sentry/browser";
import ForebyggeFraværIkon from './ForebyggeFraværIkon.svg';
import './ForebyggeFraværboks.css';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import {hentSykefravær, Sykefraværsrespons} from '../../../../api/sykefraværStatistikkApi';
import {StortTall, Tjenesteboks} from "../Tjenesteboks";


const ForebyggeFraværboks = () => {
    const valgtbedrift = () => {
        const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
        return orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`;
    };

    return <Tjenesteboks
        ikon={ForebyggeFraværIkon}
        href={lenkeTilForebyggefravar + valgtbedrift()}
        tittel='Forebygge fravær'
        aria-label={beskrivelse}
        >
        <Beskrivelse/>
    </Tjenesteboks>;
};

const beskrivelse = 'Verktøy for å forebygge fravær i din virksomhet.'

const Beskrivelse = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [sykefravær, setSykefravær] = useState<Sykefraværsrespons | undefined>(undefined);

    const statistikktype = (type:string) => {
        switch (type) {
            case 'BRANSJE':
                return 'bransje'
            case 'NÆRING':
                return 'næring'
            default :
                return 'bedrift'
        }
    }
    useEffect(() => {
        if (valgtOrganisasjon)
            hentSykefravær(valgtOrganisasjon.organisasjon.OrganizationNumber).then(sykefraværsrespons =>
                setSykefravær(sykefraværsrespons),
            ).catch(error => {
                Sentry.captureException(error)
                setSykefravær(undefined);
            });
    }, [valgtOrganisasjon]);

    if (sykefravær !== undefined) {
        return (
            <span>
                <StortTall>
                    {sykefravær.prosent.toString()} %
                </StortTall>
                <> legemeldt sykefravær i din {statistikktype(sykefravær.type)}. Lag en plan for å redusere fraværet. </>
            </span>
        );
    }
    return <span>{beskrivelse}</span>;
}

export default ForebyggeFraværboks;
