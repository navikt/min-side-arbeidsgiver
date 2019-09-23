import React, { FunctionComponent } from 'react';
import './BlaIAnsatte.less';
import './TreEllerMindre.less';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';
interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    siderTilsammen: number;
    naVarendeIndeks: number;
}

const TreSiste: FunctionComponent<Props> = props => {
    const { byttSide } = props;

    return (
        <>
            <div className={'tre-case'}>
                <>
                    <button className={'tre-case__valg'} onClick={() => byttSide(1)}>
                        <GraSirkelMedNr
                            sidetall={1}
                            siderTilsammen={props.siderTilsammen}
                            naVarendeIndeks={props.naVarendeIndeks}
                        />
                    </button>
                    ...
                </>

                <button
                    className={'tre-case__valg'}
                    onClick={() => byttSide(props.siderTilsammen - 2)}
                >
                    <GraSirkelMedNr
                        naVarendeIndeks={props.naVarendeIndeks}
                        sidetall={props.siderTilsammen - 2}
                        siderTilsammen={props.siderTilsammen}
                    />
                </button>

                <button
                    className="tre-case__valg"
                    onClick={() => byttSide(props.siderTilsammen - 1)}
                >
                    <GraSirkelMedNr
                        sidetall={props.siderTilsammen - 1}
                        siderTilsammen={props.siderTilsammen}
                        naVarendeIndeks={props.naVarendeIndeks}
                    />
                </button>
                <button className={'tre-case__valg'} onClick={() => byttSide(props.siderTilsammen)}>
                    <GraSirkelMedNr
                        sidetall={props.siderTilsammen}
                        siderTilsammen={props.siderTilsammen}
                        naVarendeIndeks={props.naVarendeIndeks}
                    />
                </button>
            </div>
        </>
    );
};

export default TreSiste;
