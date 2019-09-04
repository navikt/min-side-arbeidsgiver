import React, { FunctionComponent, useContext } from 'react';

import Lenkepanel from 'nav-frontend-lenkepanel';
import './IAwebboks.less';

import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import { arbeidsAvtaleLink } from '../../../../lenker';
import arbeidstreningikon from './arbeidstreningikon.svg';

interface Props {
    varseltekst?: string;
    className?: string;
}

const IAwebboks: FunctionComponent<Props> = props => {
    return (
        <div className={'IA-web-boks ' + props.className}>
            <TjenesteBoksBanner
                tittel={'Sykefravær'}
                imgsource={arbeidstreningikon}
                altTekst={''}
            />

            <Lenkepanel
                className={'IA-web-boks__info'}
                href={arbeidsAvtaleLink()}
                tittelProps={'normaltekst'}
                linkCreator={(props: any) => <a {...props}>{props.children}</a>}
            >
                <div className="IA-web-boks__tekst">
                    Oversikt over sykefraværet i din virksomhet og virksomheter i din bransje
                </div>
            </Lenkepanel>
        </div>
    );
};

export default IAwebboks;
