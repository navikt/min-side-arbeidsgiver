import React, { FunctionComponent } from 'react';
import "./TjenesteInfo.less";

import {Element} from "nav-frontend-typografi";


interface Props {
    overskrift: string;
    innholdstekst: string;
    lenkeTilBeOmTjeneste: string;

}

const TjenesteInfo: FunctionComponent<Props> = props => {
    return (
        <div className={'tjeneste-info'}>
            <Element className={'tjeneste-info__overskrift'}>{props.overskrift}</Element>
            {props.innholdstekst}
        </div>
    );
};

export default TjenesteInfo;