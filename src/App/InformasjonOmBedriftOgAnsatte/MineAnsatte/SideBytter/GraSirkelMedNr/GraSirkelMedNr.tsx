import React, { FunctionComponent, useState, useEffect } from 'react';
import './GraSirkelMedNr.less';
import { Element } from 'nav-frontend-typografi';
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

interface Props {
    sidetall: number;
    siderTilsammen: number;
    naVarendeIndeks: number;
    byttSide: (indeks: number) => void;
}

const GraSirkelMedNr: FunctionComponent<Props> = props => {
    const [index, setIndex] = useState('');

    useEffect(() => {
        setIndex(props.sidetall.toString());
    }, [props.sidetall]);

    return (
        <button
            key={props.sidetall}
            className={'valg'}
            onClick={() => props.byttSide(props.sidetall)}
        >
            <ReactCSSTransitionGroup
                transitionName="valg"
                transitionAppear={true}
                transitionAppearTimeout={500}
            >
                <Element className={'valg__sidetall'}>{index.toString()}</Element>
            </ReactCSSTransitionGroup>
        </button>
    );
};

export default GraSirkelMedNr;
