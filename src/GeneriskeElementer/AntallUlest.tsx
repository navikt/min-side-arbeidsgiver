import React from 'react';
import './AntallUlest.less';

export interface Props {
    antallUlest: string;
}

const AntallUlest = (props: Props) => (
    <span className="antall-ulest-sirkel">{props.antallUlest}</span>
);

export default AntallUlest;
