import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import './BlaIAnsatte.less';
import { ObjektFraAAregisteret } from '../../../../Objekter/Ansatte';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';

import GenerellVisning from './GenerellVisning';
import TreEllerMindre from './TreEllerMindre';
import TreSiste from './TreSiste';

export const finnVisningAvSideVisninger = (antallSider: number, naVarendeSide: number): string => {
    if (antallSider === 3 && naVarendeSide > 4) {
        return 'tre-sider';
    }
    if (antallSider > 3 && naVarendeSide > antallSider - 3) {
        return 'siste-tre-sider';
    }
    return 'standard-visning';
};

interface Props {
    className?: string;
    arbeidsforhold: ObjektFraAAregisteret;
    antallSider: number;
    byttSide: (indeks: number) => void;
}

const SideBytter: FunctionComponent<Props> = props => {
    const [naVarendeIndex, setnaVarendeIndex] = useState(1);
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
                    (naVarendeIndex < 3 && (
                        <TreEllerMindre
                            byttSide={byttSide}
                            siderTilsammen={antallSider}
                            naVarendeIndeks={naVarendeIndex}
                        />
                    ))}
                {antallSider > 3 && naVarendeIndex > 2 && naVarendeIndex < antallSider - 1 && (
                    <GenerellVisning
                        naVarendeIndeks={naVarendeIndex}
                        byttSide={byttSide}
                        siderTilsammen={antallSider}
                    />
                )}
                {antallSider > 3 && naVarendeIndex >= antallSider - 1 && (
                    <TreSiste
                        naVarendeIndeks={naVarendeIndex}
                        byttSide={byttSide}
                        siderTilsammen={antallSider}
                    />
                )}
            </div>
        </>
    );
};

export default SideBytter;
