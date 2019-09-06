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
            <TjenesteBoksBanner tittel={'Sykefravær'} imgsource={IAwebikon} altTekst={''} />

            <Lenkepanel
                className={'IA-web-boks__info'}
                href={lenkeIAweb}
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
