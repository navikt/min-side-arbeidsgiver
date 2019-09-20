import React, { FunctionComponent } from 'react';
import './BlaIAnsatte.less';
import './TreEllerMindre.less';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';
interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    siderTilsammen: number;
}

const TreEllerMindre: FunctionComponent<Props> = props => {
    const { byttSide } = props;

    return (
        <>
            <div className={'tre-case'}>
                <button className={'tre-case__valg'} onClick={() => byttSide(1)}>
                    <GraSirkelMedNr sidetall={1} />
                </button>

                <button className="tre-case__valg" onClick={() => byttSide(2)}>
                    <GraSirkelMedNr sidetall={2} />
                </button>
                {props.siderTilsammen > 2 && (
                    <button className={'tre-case__valg'} onClick={() => byttSide(3)}>
                        <GraSirkelMedNr sidetall={3} />
                    </button>
                )}
                {props.siderTilsammen > 3 && (
                    <>
                        ...
                        <button className={'tre-case__valg'} onClick={() => byttSide(3)}>
                            <GraSirkelMedNr sidetall={props.siderTilsammen} />
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default TreEllerMindre;
