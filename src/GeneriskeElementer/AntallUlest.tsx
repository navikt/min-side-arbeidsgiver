import React from 'react';
import './AntallUlest.less';

export interface Props {
    antallUlest: number;
}

const AntallUlest = ({antallUlest}: Props) => {
    if (antallUlest == null || antallUlest === 0) {
        return null;
    }

    return (
        <span className="antall-ulest-sirkel">{antallUlest <= 9 ? antallUlest : '9+'}</span>
    );
};

export default AntallUlest;
