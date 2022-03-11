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
    onSideValgt: (side: number) => void;
}

const SideBytter = ({antallSider, onSideValgt}: SideBytterProps) => {
    if (antallSider < 2) {
        return null;
    }
    const [valgtSide, settValgtSide] = useState(1);

    const sideKlikketPå = (side: number) => {
        settValgtSide(side);
        onSideValgt(side);
    };
    const gåTilForrigeSide = () => {
        if (valgtSide > 1) {
            sideKlikketPå(valgtSide - 1);
        }
    };
    const gåTilNesteSide = () => {
        if (valgtSide < antallSider) {
            sideKlikketPå(valgtSide + 1);
        }
    };


    return (
        <nav
            className="sidebytter"
            role={'navigation'}
            aria-label={`Sidebytter, Nåværende side er ${valgtSide}, bruk piltastene til å navigere`}
        >
            <div role={'toolbar'}>
                {valgtSide > 1 && (
                    <button
                        onKeyDown={(_) => gåTilForrigeSide()}
                        className="sidebytter__chevron"
                        onClick={() => gåTilForrigeSide()}
                        aria-label={'Gå til forrige side'}
                    >
                        <VenstreChevron/>
                    </button>
                )}

                {valgtSide > 1 && (
                    <Pagineringsknapp
                        sidetall={1}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                {valgtSide > 3 && ('...')}

                {valgtSide > 2 && (
                    <Pagineringsknapp
                        sidetall={valgtSide - 1}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                <Pagineringsknapp
                    sidetall={valgtSide}
                    gåTil={sideKlikketPå}
                    gåTilNeste={gåTilNesteSide}
                    gåTilForrige={gåTilForrigeSide}
                    erValgt={true}
                />

                {valgtSide < antallSider - 1 && (
                    <Pagineringsknapp
                        sidetall={valgtSide + 1}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                {valgtSide < antallSider - 2 && ('...')}


                {valgtSide < antallSider && (
                    <Pagineringsknapp
                        sidetall={antallSider}
                        gåTil={sideKlikketPå}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                        erSisteSide={true}
                    />
                )}

                {valgtSide < antallSider && (
                    <button
                        onKeyDown={(_) => gåTilNesteSide()}
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
