import React from 'react';
import {Element} from 'nav-frontend-typografi';
import './PagineringsKnapp.less';

interface PagineringsknappProps {
    erValgt: boolean,
    sidetall: number;
    siderTilsammen: number;
    gåTil: (side: number) => void;
    gåTilNeste: () => void;
    gåTilForrige: () => void;
}

const Pagineringsknapp = (props: PagineringsknappProps) => {

    let ariaLabel = `Gå til side ${props.sidetall}`;
    if (props.erValgt) {
        ariaLabel = `side ${props.sidetall} valgt`;
        if (props.sidetall === props.siderTilsammen) {
            ariaLabel += ' ,dette er siste side';
        }
    }

    return (
        <button
            onKeyDown={({key}) => {
                if (key === 'ArrowRight' || key === 'Right') {
                    props.gåTilNeste()
                }
                if (key === 'ArrowLeft' || key === 'Left') {
                    props.gåTilForrige()
                }
            }}
            id={'pagineringsknapp-' + props.sidetall}
            key={props.sidetall}
            className={props.erValgt ? 'sidebytter__valg er-valgt' : 'sidebytter__valg'}
            onClick={() => props.gåTil(props.sidetall)}
            aria-label={ariaLabel}
            aria-current={props.erValgt}
        >
            <Element className="valg__sidetall">{props.sidetall}</Element>
        </button>
    );
};

export default Pagineringsknapp;
