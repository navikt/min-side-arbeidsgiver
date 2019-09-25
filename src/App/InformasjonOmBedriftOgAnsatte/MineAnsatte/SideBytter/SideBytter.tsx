import React, { FunctionComponent, useState, useContext } from 'react';
import './BlaIAnsatte.less';
import { ObjektFraAAregisteret } from '../../../../Objekter/Ansatte';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';

import GenerellVisning from './GenerellVisning';
import TreEllerMindre from './TreEllerMindre';
import TreSiste from './TreSiste';

interface Props {
    className?: string;
    arbeidsforhold: ObjektFraAAregisteret;
    antallSider: number;
    byttSide: (indeks: number) => void;
    naVarendeIndeks: number;
}

const SideBytter: FunctionComponent<Props> = props => {
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    const [antallSider, setAntallSider] = useState(0);
    const { byttSide } = props;

    return (
        <>
            <div tabIndex={0} className={'antall-forhold'}>
                {mineAnsatte.arbeidsforholdoversikter.length} arbeidsforhold
            </div>
            <div className="sidebytter">
                {antallSider < 4 ||
                    (props.naVarendeIndeks < 3 && (
                        <TreEllerMindre
                            byttSide={byttSide}
                            siderTilsammen={antallSider}
                            naVarendeIndeks={props.naVarendeIndeks}
                        />
                    ))}
                {antallSider > 3 &&
                    props.naVarendeIndeks > 2 &&
                    props.naVarendeIndeks < antallSider - 1 && (
                        <GenerellVisning
                            naVarendeIndeks={props.naVarendeIndeks}
                            byttSide={byttSide}
                            siderTilsammen={antallSider}
                        />
                    )}
                {antallSider > 3 && props.naVarendeIndeks >= antallSider - 1 && (
                    <TreSiste
                        naVarendeIndeks={props.naVarendeIndeks}
                        byttSide={byttSide}
                        siderTilsammen={antallSider}
                    />
                )}
            </div>
        </>
    );
};

export default SideBytter;
