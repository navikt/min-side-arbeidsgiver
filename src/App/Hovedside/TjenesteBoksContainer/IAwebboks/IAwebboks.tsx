import {lenkeTilForebyggefravar} from '../../../../lenker';
import React, { useContext, useEffect, useState } from 'react';
import IAwebikon from './IawebIkon.svg';
import './IAwebboks.less';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import {hentSykefravær, Sykefraværsrespons} from '../../../../api/sykefraværStatistikkApi';
import {Tjenesteboks} from "../Tjenesteboks";


const IAwebboks = () => {
    const valgtbedrift = () => {
        const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
        return orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`;
    };

    return <Tjenesteboks
        ikon={IAwebikon}
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
    return <span>{beskrivelse}</span>;
}

export default IAwebboks;
