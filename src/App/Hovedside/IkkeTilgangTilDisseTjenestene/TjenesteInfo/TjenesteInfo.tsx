import React, { FunctionComponent } from 'react';
import "./TjenesteInfo.less";
import nyfane from './nyfane.svg';

import {Element} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";


interface Props {
    overskrift: string;
    innholdstekst: string;
    lenkeTilBeOmTjeneste: string;

}

const TjenesteInfo: FunctionComponent<Props> = props => {
    return (
        <div className={'tjeneste-info'}>
            <Lenke className={'tjeneste-info__lenke'} href={props.lenkeTilBeOmTjeneste}>Be om tilgang <img src={nyfane}/> </Lenke>
            <Element className={'tjeneste-info__overskrift'}>{props.overskrift}</Element>
            {props.innholdstekst}
        </div>
    );
};

export default TjenesteInfo;