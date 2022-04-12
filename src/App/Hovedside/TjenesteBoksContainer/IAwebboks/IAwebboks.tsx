import React, {useContext, useEffect, useState} from 'react';
import {lenkeTilSykefravarsstatistikk} from '../../../../lenker';
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
        href={lenkeTilSykefravarsstatistikk + valgtbedrift()}
        tittel={'Sykefraværsstatistikk'}
        aria-label={beskrivelse}
        >
        <Beskrivelse/>
    </Tjenesteboks>;
};

const beskrivelse = 'Har du høyere eller lavere sykefravær sammenlignet med din bransje? Se tallene ' +
    'og tips om hvordan du kan påvirke sykefraværet ditt'

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
                <> legemeldt sykefravær i din {statistikktype(sykefravær.type)}. Slik kan du forebygge sykefravær.   </>
            </span>
        );
    }
    return <span>{beskrivelse}</span>;
}

export default IAwebboks;
