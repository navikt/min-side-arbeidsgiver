import React, { FunctionComponent } from 'react';
import './AttributtVisning.less';

interface Props {
    className?: string;
    attributt: string;
    attributtVerdi: string;
}

const AttributtVisning: FunctionComponent<Props> = props => {
    return (
        <li className="attributt">
            <div className={'attributt__navn'}> {props.attributt}</div>
            <div className={'attributt__verdi'}>{props.attributtVerdi}</div>
        </li>
    );
};

export default AttributtVisning;
