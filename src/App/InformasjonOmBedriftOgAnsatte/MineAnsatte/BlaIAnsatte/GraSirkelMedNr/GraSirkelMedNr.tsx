import React, { FunctionComponent, useState, useEffect } from 'react';
import './GraSirkelMedNr.less';
import { Element } from 'nav-frontend-typografi';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

interface Props {
    sidetall: number;
    erValgt?: string;
}

const GraSirkelMedNr: FunctionComponent<Props> = props => {
    const [index, setIndex] = useState('');

    useEffect(() => {
        setIndex(props.sidetall.toString());
    }, [index, props.sidetall]);

    return (
        <div className={'gra-sirkel-uten' + props.erValgt} key={index}>
            <ReactCSSTransitionGroup
                transitionName="gra-sirkel-uten"
                transitionAppear={true}
                transitionAppearTimeout={5000}
                transitionEnter={false}
                transitionLeave={false}
            >
                <Element className={'gra-sirkel__sidetall'}>{index.toString()}</Element>
            </ReactCSSTransitionGroup>
        </div>
    );
};

export default GraSirkelMedNr;
