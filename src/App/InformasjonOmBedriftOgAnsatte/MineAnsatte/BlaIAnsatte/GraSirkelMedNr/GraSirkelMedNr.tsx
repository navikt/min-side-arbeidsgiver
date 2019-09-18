import React, { FunctionComponent, useContext } from 'react';
import './GraSirkelMedNr.less';
import { Element } from 'nav-frontend-typografi';

interface Props {
    sidetall: number;
}

const GraSirkelMedNr: FunctionComponent<Props> = props => {
    return (
        <>
            <div className={'gra-sirkel-uten'}>
                <Element className={'gra-sirkel__sidetall'}>{props.sidetall.toString()}</Element>
            </div>
            <div>
                <span className="gra-sirkel">
                    <Element className={'gra-sirkel__sidetall'}>
                        {props.sidetall.toString()}
                    </Element>
                </span>
            </div>
        </>
    );
};

export default GraSirkelMedNr;
