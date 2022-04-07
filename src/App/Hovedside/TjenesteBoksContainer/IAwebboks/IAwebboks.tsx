import React, { useContext, useEffect, useState } from 'react';
import { lenkeTilForebyggefravar } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import IAwebikon from './IawebIkon.svg';
import './IAwebboks.less';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { hentSykefravær, Sykefraværsrespons } from '../../../../api/sykefraværStatistikkApi';


const IAwebboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [sykefravær, setSykefravær] = useState<Sykefraværsrespons | undefined>(undefined);

    const statistikktype = (type:string)=>{
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
            ).catch(error => setSykefravær(undefined));
    }, [valgtOrganisasjon]);

    const TekstMedTall = () => {
        if (sykefravær !== undefined) {
            return (
                <span>
                <span className={'legemeldt-sykefravær-prosent'}>
                    {sykefravær.prosent.toString()} %
                </span>
                <> legemeldt sykefravær i din {statistikktype(sykefravær.type)}. Slik kan du forebygge fravær.   </>
            </span>
            );
        }
        return TekstUtenTall();
    };

    const TekstUtenTall = () =>
        <>
            Verktøy  for å forebygge fravær i din virksomhet.
        </>;


    const valgtbedrift = () => {
        const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
        return orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`;
    };

    return (
        <div className='IA-web-boks tjenesteboks-innhold'>
            <TjenesteBoksBanner tittel='Forebygge fravær' imgsource={IAwebikon} altTekst='' />
            <LenkepanelMedLogging
                className='IA-web-boks__info'
                href={lenkeTilForebyggefravar + valgtbedrift()}
                tittelProps='normaltekst'
                loggLenketekst='Forebygge-fravær'
            >
                <div className='IA-web-boks__tekst'>
                    {sykefravær !== undefined? TekstMedTall() : TekstUtenTall()}
                </div>
            </LenkepanelMedLogging>
        </div>
    );
};

export default IAwebboks;
