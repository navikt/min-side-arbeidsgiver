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
    const [erValgt, setErvalgt] = useState('ikke-valgt');

    useEffect(() => {
        console.log('useeffect grå sirkel', index);
        setErvalgt('0');
        if (props.naVarendeIndeks === props.sidetall) {
            setErvalgt('sidebytter__valgt');
        } else {
            setErvalgt('ikke-valgt');
        }

        console.log('navarende index,', props.naVarendeIndeks);
        console.log('sidetall: ', props.sidetall);
        setIndex(props.sidetall.toString());
    }, [props.sidetall, props.naVarendeIndeks, index]);

    return (
        <div key={props.sidetall} className={erValgt}>
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
