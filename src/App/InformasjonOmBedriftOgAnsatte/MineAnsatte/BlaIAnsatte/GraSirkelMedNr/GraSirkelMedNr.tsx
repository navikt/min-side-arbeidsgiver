import React, { FunctionComponent, useContext, useEffect } from 'react';
import './GraSirkelMedNr.less';
import { Element } from 'nav-frontend-typografi';

interface Props {
    sidetall: number;
}

const GraSirkelMedNr: FunctionComponent<Props> = props => {
    return (
        <div className={'gra-sirkel-uten'}>
            <Element className={'gra-sirkel__sidetall'}>{props.sidetall.toString()}</Element>
        </div>
    );
};

export default GraSirkelMedNr;
