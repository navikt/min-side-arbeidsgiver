import React, {useState} from 'react';
import {HoyreChevron, VenstreChevron} from 'nav-frontend-chevron';
import './SideBytter.less';
import {Element} from "nav-frontend-typografi";

interface PagineringsknappProps {
    erValgt?: boolean,
    erSisteSide?: boolean;
    sidetall: number;
    gåTil: (side: number) => void;
    gåTilNeste: () => void;
    gåTilForrige: () => void;
}

const Pagineringsknapp = ({
                              erValgt = false,
                              erSisteSide = false,
                              sidetall,
                              gåTil,
                              gåTilNeste,
                              gåTilForrige,
                          }: PagineringsknappProps) => {

    let ariaLabel = `Gå til side ${sidetall}`;
    if (erValgt) {
        ariaLabel = `side ${sidetall} valgt`;
        if (erSisteSide) {
            ariaLabel += ' ,dette er siste side';
        }
    }

    return (
        <button
            onClick={() => gåTil(sidetall)}
            onKeyDown={({key}) => {
                if (key === 'ArrowRight' || key === 'Right') {
                    gåTilNeste()
                }
                if (key === 'ArrowLeft' || key === 'Left') {
                    gåTilForrige()
                }
            }}
            id={'pagineringsknapp-' + sidetall}
            key={sidetall}
            className={`sidebytter__valg ${erValgt && 'er-valgt'}`}
            aria-label={ariaLabel}
            aria-current={erValgt}
        >
            <Element className="valg__sidetall">{sidetall}</Element>
        </button>
    );
};

interface SideBytterProps {
    antallSider: number;
}

const SideBytter = ({antallSider}: SideBytterProps) => {
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
                        <VenstreChevron/>
                    </button>
                )}

                {nåVærendeSidetall > 1 && (
                    <Pagineringsknapp
                        sidetall={1}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                {nåVærendeSidetall > 3 && ('...')}

                {nåVærendeSidetall > 2 && (
                    <Pagineringsknapp
                        sidetall={nåVærendeSidetall - 1}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                <Pagineringsknapp
                    sidetall={nåVærendeSidetall}
                    gåTil={sideKlikketPå}
                    gåTilNeste={gåTilNesteSide}
                    gåTilForrige={gåTilForrigeSide}
                    erValgt={true}
                />

                {nåVærendeSidetall < antallSider - 1 && (
                    <Pagineringsknapp
                        sidetall={nåVærendeSidetall + 1}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                {nåVærendeSidetall < antallSider - 2 && ('...')}


                {nåVærendeSidetall < antallSider && (
                    <Pagineringsknapp
                        sidetall={antallSider}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                        erSisteSide={true}
                    />
                )}

                {nåVærendeSidetall < antallSider && (
                    <button
                        onKeyDown={(e) => gåTilNesteSide()}
                        className={'sidebytter__chevron'}
                        onClick={() => gåTilNesteSide()}
                        aria-label={'Gå til neste side'}
                    >
                        <HoyreChevron/>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default SideBytter;
