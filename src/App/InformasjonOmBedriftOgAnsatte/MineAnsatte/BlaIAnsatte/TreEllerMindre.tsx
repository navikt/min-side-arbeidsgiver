import React, { FunctionComponent } from 'react';
import './BlaIAnsatte.less';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';
interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    siderTilsammen: number;
    naVarendeIndeks: number;
}

const TreEllerMindre: FunctionComponent<Props> = props => {
    const { byttSide } = props;

    return (
        <>
            <button className={'sidebytter__valg'} onClick={() => byttSide(1)}>
                <GraSirkelMedNr
                    naVarendeIndeks={props.naVarendeIndeks}
                    sidetall={1}
                    siderTilsammen={props.siderTilsammen}
                />
            </button>

            <button className="sidebytter__valg" onClick={() => byttSide(2)}>
                <GraSirkelMedNr
                    sidetall={2}
                    siderTilsammen={props.siderTilsammen}
                    naVarendeIndeks={props.naVarendeIndeks}
                />
            </button>
            {props.siderTilsammen > 2 && (
                <button className={'sidebytter__valg'} onClick={() => byttSide(3)}>
                    <GraSirkelMedNr
                        sidetall={3}
                        siderTilsammen={props.siderTilsammen}
                        naVarendeIndeks={props.naVarendeIndeks}
                    />
                </button>
            )}
            {props.siderTilsammen > 3 && (
                <>
                    ...
                    <button
                        className={'sidebytter__valg'}
                        onClick={() => byttSide(props.siderTilsammen)}
                    >
                        <GraSirkelMedNr
                            sidetall={props.siderTilsammen}
                            siderTilsammen={props.siderTilsammen}
                            naVarendeIndeks={props.naVarendeIndeks}
                        />
                    </button>
                </>
            )}
        </>
    );
};

export default TreEllerMindre;
