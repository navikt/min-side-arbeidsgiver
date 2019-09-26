import React, { FunctionComponent, useState, useContext } from 'react';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import { ObjektFraAAregisteret } from '../../../../Objekter/Ansatte';
import './SideBytter.less';

import TreEllerMindre from './TreEllerMindre';
import TreSiste from './TreSiste';
import GenerellVisning from './GenerellVisning';

interface Props {
    className?: string;
    arbeidsforhold: ObjektFraAAregisteret;
    antallSider: number;
    byttSide: (indeks: number) => void;
    naVarendeIndeks: number;
}

const SideBytter: FunctionComponent<Props> = props => {
    const { byttSide } = props;

    return (
        <>
            <div className="sidebytter">
                {props.naVarendeIndeks !== 1 && (
                    <button
                        className="sidebytter__chevron"
                        onClick={() => props.byttSide(props.naVarendeIndeks - 1)}
                    >
                        <VenstreChevron type={'venstre'} />
                    </button>
                )}
                {props.antallSider < 4 ||
                    (props.naVarendeIndeks < 3 && (
                        <TreEllerMindre
                            byttSide={byttSide}
                            siderTilsammen={props.antallSider}
                            naVarendeIndeks={props.naVarendeIndeks}
                        />
                    ))}
                {props.antallSider > 3 &&
                    props.naVarendeIndeks > 2 &&
                    props.naVarendeIndeks < props.antallSider - 1 && (
                        <GenerellVisning
                            naVarendeIndeks={props.naVarendeIndeks}
                            byttSide={byttSide}
                            siderTilsammen={props.antallSider}
                        />
                    )}
                {props.antallSider > 3 && props.naVarendeIndeks >= props.antallSider - 1 && (
                    <TreSiste
                        naVarendeIndeks={props.naVarendeIndeks}
                        byttSide={byttSide}
                        siderTilsammen={props.antallSider}
                    />
                )}

                <button
                    className="sidebytter__chevron"
                    onClick={() => props.byttSide(props.naVarendeIndeks + 1)}
                >
                    <HoyreChevron />
                </button>
            </div>
        </>
    );
};

export default SideBytter;
