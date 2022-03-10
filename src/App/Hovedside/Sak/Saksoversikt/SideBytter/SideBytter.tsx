import React, { useState } from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import './SideBytter.less';
import {Element} from "nav-frontend-typografi";

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

interface SideBytterProps {
    antallSider: number;
}

const SideBytter = ({ antallSider }: SideBytterProps) => {
    if (antallSider < 2) {
        return null;
    }

    const [nåVærendeSidetall, settNåværendeSideTall] = useState(1);

    const sideKlikketPå = (side: number) => {
        settNåværendeSideTall(side)
    };
    const gåTilForrigeSide = () => {
        if (nåVærendeSidetall > 1) {
            settNåværendeSideTall(nåVærendeSidetall - 1)
        }
    };
    const gåTilNesteSide = () => {
        if (nåVærendeSidetall < antallSider) {
            settNåværendeSideTall(nåVærendeSidetall + 1)
        }
    };


    return (
        <nav
            className="sidebytter"
            role={'navigation'}
            aria-label={`Sidebytter, Nåværende side er ${nåVærendeSidetall}, bruk piltastene til å navigere`}
        >
            <div role={'toolbar'}>
                {nåVærendeSidetall > 1 && (
                    <button
                        onKeyDown={(e) => gåTilForrigeSide()}
                        className="sidebytter__chevron"
                        onClick={() => gåTilForrigeSide()}
                        aria-label={'Gå til forrige side'}
                    >
                        <VenstreChevron />
                    </button>
                )}

                {nåVærendeSidetall > 1 && (
                    <Pagineringsknapp
                        sidetall={1}
                        siderTilsammen={antallSider}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                        erValgt={false}
                    />
                )}

                {nåVærendeSidetall > 3 && ('...')}

                {nåVærendeSidetall > 2 && (
                    <Pagineringsknapp
                        sidetall={nåVærendeSidetall - 1}
                        siderTilsammen={antallSider}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                        erValgt={false}
                    />
                )}

                <Pagineringsknapp
                    sidetall={nåVærendeSidetall}
                    siderTilsammen={antallSider}
                    gåTil={sideKlikketPå}
                    gåTilNeste={gåTilNesteSide}
                    gåTilForrige={gåTilForrigeSide}
                    erValgt={true}
                />

                {nåVærendeSidetall < antallSider - 1 && (
                    <Pagineringsknapp
                        sidetall={nåVærendeSidetall + 1}
                        siderTilsammen={antallSider}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                        erValgt={false}
                    />
                )}

                {nåVærendeSidetall < antallSider - 2 && ('...')}


                {nåVærendeSidetall < antallSider && (
                    <Pagineringsknapp
                        sidetall={antallSider}
                        siderTilsammen={antallSider}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                        erValgt={false}
                    />
                )}

                {nåVærendeSidetall < antallSider && (
                    <button
                        onKeyDown={(e) => gåTilNesteSide()}
                        className={'sidebytter__chevron'}
                        onClick={() => gåTilNesteSide()}
                        aria-label={'Gå til neste side'}
                    >
                        <HoyreChevron />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default SideBytter;
