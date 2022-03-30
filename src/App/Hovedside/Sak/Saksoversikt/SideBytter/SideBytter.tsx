import React from 'react';
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
                          }: PagineringsknappProps) => {

    let ariaLabel = `Gå til side ${sidetall}`;
    if (erValgt) {
        ariaLabel = `side ${sidetall} valgt`;
        if (erSisteSide) {
            ariaLabel += ', dette er siste side';
        }
    }

    return (
        <button
            onClick={() => gåTil(sidetall)}
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
    antallSider?: number;
    side?: number;
    onSideValgt: (side: number) => void;
}

const SideBytter = ({antallSider, onSideValgt, side}: SideBytterProps) => {
    if (antallSider === undefined || side === undefined)
        return null;

    if (antallSider < 2) {
        return null;
    }

    const gåTilForrigeSide = () => {
        if (side > 1) {
            onSideValgt(side - 1);
        }
    };
    const gåTilNesteSide = () => {
        if (side < antallSider) {
            onSideValgt(side + 1);
        }
    };


    return (
        <nav
            className="sidebytter"
            role="navigation"
            aria-label={`Sidebytter. Nåværende side er ${side}.`}
        >
            <div role={'toolbar'}>
                {side > 1 && (
                    <button
                        className="sidebytter__chevron"
                        onClick={gåTilForrigeSide}
                        aria-label={'Gå til forrige side'}
                    >
                        <VenstreChevron/>
                    </button>
                )}

                {side > 1 && (
                    <Pagineringsknapp
                        sidetall={1}
                        gåTil={onSideValgt}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                {side > 3 && ('...')}

                {side > 2 && (
                    <Pagineringsknapp
                        sidetall={side - 1}
                        gåTil={onSideValgt}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                <Pagineringsknapp
                    sidetall={side}
                    gåTil={onSideValgt}
                    gåTilNeste={gåTilNesteSide}
                    gåTilForrige={gåTilForrigeSide}
                    erValgt={true}
                />

                {side < antallSider - 1 && (
                    <Pagineringsknapp
                        sidetall={side + 1}
                        gåTil={onSideValgt}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                    />
                )}

                {side < antallSider - 2 && ('...')}

                {side < antallSider && (
                    <Pagineringsknapp
                        sidetall={antallSider}
                        gåTil={onSideValgt}
                        gåTilNeste={gåTilNesteSide}
                        gåTilForrige={gåTilForrigeSide}
                        erSisteSide={true}
                    />
                )}

                {side < antallSider && (
                    <button
                        className={'sidebytter__chevron'}
                        onClick={gåTilNesteSide}
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
