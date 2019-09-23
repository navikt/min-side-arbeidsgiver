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
        console.log('navarende index,', props.naVarendeIndeks);
        console.log('sidetall: ', props.sidetall);
        setIndex(props.sidetall.toString());
    }, [props.sidetall]);

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
