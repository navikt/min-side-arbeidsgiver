import React, { FunctionComponent } from 'react';
import './AttributtVisning.less';

interface Props {
    className?: string;
    attributt: string;
    attributtVerdi: string;
}

const AttributtVisning: FunctionComponent<Props> = props => {
    return (
        <li className="arbeidsforhold__attributt">
            <div className={'arbeidsforhold__attributt__navn'}> {props.attributt}</div>
            <div className={'arbeidsforhold__attributt__verdi'}>{props.attributtVerdi}</div>
        </li>
    );
};

export default AttributtVisning;
