import React, { FunctionComponent } from 'react';
import './Ansatt.less';

import { enkelArbeidsforhold } from '../../../../../../Objekter/Ansatte';

interface Props {
    className?: string;
    arbeidsforhold: enkelArbeidsforhold;
}

const Ansatt: FunctionComponent<Props> = props => {
    return (
        <div className="arbeidsforhold">
            <li className="arbeidsforhold">
                <ul>
                    <li className="arbeidsforhold__attributt">
                        <> Offentlig Ident</>
                        <>{props.arbeidsforhold.arbeidstaker.offentligIdent}</>
                    </li>
                    <li className="arbeidsforhold__attributt">
                        {props.arbeidsforhold.arbeidsavtaler[0].yrke}
                    </li>
                    <li className="arbeidsforhold__attributt">
                        {props.arbeidsforhold.ansettelsesperiode.periode.fom}
                    </li>
                    <li className="arbeidsforhold__attributt">
                        {props.arbeidsforhold.ansettelsesperiode.periode.fom}
                    </li>
                </ul>
            </li>
        </div>
    );
};

export default Ansatt;
