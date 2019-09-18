import React, { FunctionComponent, useState } from 'react';
import './GraSirkelMedNr.less';
import { Element } from 'nav-frontend-typografi';

interface Props {
    sidetall: number;
}

const GraSirkelMedAnimasjon: FunctionComponent<Props> = props => {
    return (
        <div>
            <span className="gra-sirkel">
                <Element className={'gra-sirkel__sidetall'}>{props.sidetall.toString()}</Element>
            </span>
        </div>
    );
};

export default GraSirkelMedAnimasjon;
