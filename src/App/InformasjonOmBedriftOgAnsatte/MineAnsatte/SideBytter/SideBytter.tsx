import React, { FunctionComponent, useState, useContext } from 'react';
import { ObjektFraAAregisteret } from '../../../../Objekter/Ansatte';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
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
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    const { byttSide } = props;

    return (
        <>
            <div tabIndex={0} className={'antall-forhold'}>
                {mineAnsatte.arbeidsforholdoversikter.length} arbeidsforhold
            </div>
            <div className="sidebytter">
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
            </div>
        </>
    );
};

export default SideBytter;
