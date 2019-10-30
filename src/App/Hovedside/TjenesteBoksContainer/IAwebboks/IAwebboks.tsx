import React, { FunctionComponent } from 'react';

import Lenkepanel from 'nav-frontend-lenkepanel';
import './IAwebboks.less';

import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import IAwebikon from './soylediagram.svg';
import { lenkeIAweb } from '../../../../lenker';

interface Props {
    varseltekst?: string;
    className?: string;
}

const IAwebboks: FunctionComponent<Props> = props => {
    return (
        <div className={'IA-web-boks ' + props.className}>
            <TjenesteBoksBanner
                tittel={'Sykefraværsstatistikk'}
                imgsource={IAwebikon}
                altTekst={''}
            />

            <Lenkepanel
                className={'IA-web-boks__info'}
                href={lenkeIAweb}
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
