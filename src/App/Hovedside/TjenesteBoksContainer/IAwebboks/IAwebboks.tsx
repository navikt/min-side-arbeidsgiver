import React, { FunctionComponent } from 'react';

import Lenkepanel from 'nav-frontend-lenkepanel';
import './IAwebboks.less';

import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import IAwebikon from './IawebIkon.svg';
import { lenkeTilSykefravarsstatistikk } from '../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';

interface Props {
    varseltekst?: string;
    className?: string;
}

const loggAtKlikketPaIAeb = () => {
    loggTjenesteTrykketPa('IA');
};

const IAwebboks: FunctionComponent<Props> = props => {
    return (
        <div className={'IA-web-boks ' + props.className} onClick={loggAtKlikketPaIAeb}>
            <TjenesteBoksBanner
                tittel={'Sykefraværsstatistikk'}
                imgsource={IAwebikon}
                altTekst={''}
            />

            <Lenkepanel
                className={'IA-web-boks__info'}
                href={lenkeTilSykefravarsstatistikk}
                tittelProps={'normaltekst'}
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
