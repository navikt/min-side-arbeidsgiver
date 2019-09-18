import React, { FunctionComponent, useContext, useEffect } from 'react';
import './GraSirkelMedNr.less';
import { Element } from 'nav-frontend-typografi';

interface Props {
    sidetall: number;
    erValgt?: string;
}

const GraSirkelMedNr: FunctionComponent<Props> = props => {
    return (
        <div className={'gra-sirkel-uten' + props.erValgt}>
            <Element className={'gra-sirkel__sidetall'}>{props.sidetall.toString()}</Element>
        </div>
    );
};

export default GraSirkelMedNr;
