import React, { FunctionComponent } from 'react';
import './Ansatt.less';

import AttributtVisning from './AttributtVisning/AttributtVisning';
import { enkelArbeidsforhold } from '../../../../../Objekter/Ansatte';

interface Props {
    className?: string;
    arbeidsforhold: enkelArbeidsforhold;
}

const Ansatt: FunctionComponent<Props> = props => {
    return (
        <li className="arbeidsforhold">
            <ul className="arbeidsforhold__liste">
                <AttributtVisning
                    attributt="Offentlig Ident"
                    attributtVerdi={props.arbeidsforhold.arbeidstaker.offentligIdent}
                />
                <AttributtVisning
                    attributt="Yrke"
                    attributtVerdi={props.arbeidsforhold.arbeidsavtaler[0].yrke}
                />
                <AttributtVisning
                    attributt="Startet"
                    attributtVerdi={props.arbeidsforhold.ansettelsesperiode.periode.fom}
                />
                <AttributtVisning
                    attributt="Slutter"
                    attributtVerdi={props.arbeidsforhold.ansettelsesperiode.periode.tom}
                />
            </ul>
        </li>
    );
};

export default Ansatt;
