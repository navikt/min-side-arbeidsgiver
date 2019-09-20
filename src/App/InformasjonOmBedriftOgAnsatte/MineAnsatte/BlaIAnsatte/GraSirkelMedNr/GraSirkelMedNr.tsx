import React, { FunctionComponent, useState, useEffect } from 'react';
import './GraSirkelMedNr.less';
import { Element } from 'nav-frontend-typografi';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

interface Props {
    sidetall: number;
    siderTilsammen: number;
    naVarendeIndeks: number;
}

const GraSirkelMedNr: FunctionComponent<Props> = props => {
    const [index, setIndex] = useState('');

    useEffect(() => {
        if (props.naVarendeIndeks > props.siderTilsammen - 1) {
            setIndex((props.sidetall - 1).toString());
        } else {
            setIndex(props.sidetall.toString());
        }
    }, [index, props.sidetall, props.siderTilsammen]);

    return (
        <div className={'indeks-valg'} key={index}>
            <ReactCSSTransitionGroup
                transitionName="indeks-valg"
                transitionAppear={true}
                transitionAppearTimeout={500}
            >
                <Element className={'indeks-valg__sidetall'}>{index.toString()}</Element>
            </ReactCSSTransitionGroup>
        </div>
    );
};

export default GraSirkelMedNr;
