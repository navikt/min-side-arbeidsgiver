import React, { useState } from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import './SideBytter.less';
import PagineringsKnapp from "./PagineringsKnapp/PagineringsKnapp";

interface Props {
    antallSider: number;
}

const SideBytter = ({ antallSider }: Props) => {
    const chevronOverst = document.getElementById('sidebytter-chevron-hoyre-overst');
    const chevronNederst = document.getElementById('sidebytter-chevron-hoyre-nederst');
    const plassering = '';

    const sideKlikketPå = (side: number) => {
        console.log("valgt side", side);
    };
    const gåTilForrigeSide = () => {
        console.log("gå til forrige");
    };
    const gåTilNesteSide = () => {
        console.log("gå til neste");
    };

    const nåVærendeSidetallParameter = '1';
    const nåVærendeSidetall = parseInt(nåVærendeSidetallParameter);

    if (chevronOverst && chevronNederst) {
        if (nåVærendeSidetall !== antallSider) {
            chevronOverst.style.visibility = 'initial';
            chevronNederst.style.visibility = 'initial';
        } else {
            chevronOverst.style.visibility = 'hidden';
            chevronNederst.style.visibility = 'hidden';
        }
    }

    return (
        <nav
            className="sidebytter"
            role={'navigation'}
            aria-label={`Sidebytter, Nåværende side er ${nåVærendeSidetall}, bruk piltastene til å navigere`}
        >
            <div role={'toolbar'}>
                {nåVærendeSidetall !== 1 && (
                    <button
                        onKeyDown={(e) => gåTilForrigeSide()}
                        className="sidebytter__chevron"
                        onClick={() => gåTilForrigeSide()}
                        aria-label={'Gå til forrige side'}
                    >
                        <VenstreChevron type={'venstre'} />
                    </button>
                )}

                {(nåVærendeSidetall < 3 || antallSider < 4) && (
                    <>
                        <PagineringsKnapp
                            sidetall={1}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={nåVærendeSidetall === 1}
                        />

                        <PagineringsKnapp
                            sidetall={2}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={nåVærendeSidetall === 2}
                        />

                        {antallSider > 2 && (
                            <PagineringsKnapp
                                sidetall={3}
                                siderTilsammen={antallSider}
                                onKlikketPåSide={sideKlikketPå}
                                erValgt={nåVærendeSidetall === 3}
                            />
                        )}

                        {antallSider > 3 && (
                            <>
                                ...
                                <PagineringsKnapp
                                    sidetall={4}
                                    siderTilsammen={antallSider}
                                    onKlikketPåSide={sideKlikketPå}
                                    erValgt={nåVærendeSidetall === 4}
                                />
                            </>
                        )}
                    </>
                )}


                {antallSider > 3 && nåVærendeSidetall > 2 && nåVærendeSidetall < antallSider - 1 && (
                    <>
                        <PagineringsKnapp
                            sidetall={1}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={false}
                        />
                        ...
                        <PagineringsKnapp
                            sidetall={nåVærendeSidetall - 1}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={false}
                        />
                        <PagineringsKnapp
                            sidetall={nåVærendeSidetall}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={true}
                        />
                        <PagineringsKnapp
                            sidetall={nåVærendeSidetall + 1}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={false}
                        />
                        {nåVærendeSidetall < antallSider - 1 && (
                            <>
                                ...
                                <PagineringsKnapp
                                    sidetall={antallSider}
                                    siderTilsammen={antallSider}
                                    onKlikketPåSide={sideKlikketPå}
                                    erValgt={false}
                                />
                            </>
                        )}
                    </>
                )}
                {antallSider > 3 && nåVærendeSidetall >= antallSider - 1 && (
                    <>
                        <PagineringsKnapp
                            sidetall={1}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={false}
                        />
                        ...
                        <PagineringsKnapp
                            sidetall={antallSider - 2}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={false}
                        />

                        <PagineringsKnapp
                            sidetall={antallSider - 1}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={nåVærendeSidetall === antallSider - 1}
                        />
                        <PagineringsKnapp
                            sidetall={antallSider}
                            siderTilsammen={antallSider}
                            onKlikketPåSide={sideKlikketPå}
                            erValgt={nåVærendeSidetall === antallSider}
                        />
                    </>
                )}
                <button
                    onKeyDown={(e) => gåTilNesteSide()}
                    className={'sidebytter__chevron'}
                    onClick={() => gåTilNesteSide()}
                    aria-label={'Gå til neste side'}
                    id={'sidebytter-chevron-hoyre-' + plassering}
                >
                    <HoyreChevron />
                </button>
            </div>
        </nav>
    );
};

export default SideBytter;
