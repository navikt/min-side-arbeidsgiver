import React, { FunctionComponent } from 'react';
import './Ansatt.less';

import AttributtVisning from './AttributtVisning/AttributtVisning';
import { enkelArbeidsforhold } from '../../../../../Objekter/Ansatte';

interface Props {
    className?: string;
    navn: string;
    offentligID: string;
    yrke: string;
    fom: string;
    tom: string;
}

const Ansatt: FunctionComponent<Props> = props => {
    return (
        <li className="arbeidsforhold">
            <ul className="arbeidsforhold__liste">
                <AttributtVisning attributt="Navn" attributtVerdi={props.navn} />
                <AttributtVisning attributt="Offentlig Ident" attributtVerdi={props.offentligID} />
                <AttributtVisning attributt="Yrke" attributtVerdi={props.yrke} />
                <AttributtVisning attributt="Startet" attributtVerdi={props.fom} />
                <AttributtVisning attributt="Slutter" attributtVerdi={props.tom} />
                <AttributtVisning attributt="Varsling" attributtVerdi="9" />
            </ul>
        </li>
    );
};

export default Ansatt;
