import React from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import IAwebikon from './IawebIkon.svg';
import { lenkeTilSykefravarsstatistikk } from '../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import './IAwebboks.less';

const loggAtKlikketPaIAeb = () => {
    loggTjenesteTrykketPa('IA');
};

const IAwebboks = () => {
    return (
        <div className="IA-web-boks tjenesteboks-innhold" onClick={loggAtKlikketPaIAeb}>
            <TjenesteBoksBanner
                tittel="Sykefraværsstatistikk"
                imgsource={IAwebikon}
                altTekst=""
            />
            <Lenkepanel
                className="IA-web-boks__info"
                href={lenkeTilSykefravarsstatistikk}
                tittelProps="normaltekst"
                linkCreator={(props: any) => <a {...props}>{props.children}</a>}
            >
                <div className="IA-web-boks__tekst">
                    Oversikt over sykefravær i din virksomhet og bransje
                </div>
            </Lenkepanel>
        </div>
    );
};

export default IAwebboks;
