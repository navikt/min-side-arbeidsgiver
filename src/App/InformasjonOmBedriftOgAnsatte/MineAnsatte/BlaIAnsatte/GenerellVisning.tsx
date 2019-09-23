import React, { FunctionComponent } from 'react';
import './BlaIAnsatte.less';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';
interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    naVarendeIndeks: number;
    siderTilsammen: number;
}

const GenerellVisning: FunctionComponent<Props> = props => {
    const { byttSide } = props;

    return (
        <>
            <button className={'sidebytter__valg'} onClick={() => byttSide(1)}>
                <GraSirkelMedNr
                    naVarendeIndeks={props.naVarendeIndeks}
                    siderTilsammen={props.siderTilsammen}
                    sidetall={1}
                />
            </button>
            ...
            <button
                className={'sidebytter__valg'}
                onClick={() => byttSide(props.naVarendeIndeks - 1)}
            >
                <GraSirkelMedNr
                    naVarendeIndeks={props.naVarendeIndeks}
                    siderTilsammen={props.siderTilsammen}
                    sidetall={props.naVarendeIndeks - 1}
                />
            </button>
            <button className="sidebytter__valg erValgt">
                <GraSirkelMedNr
                    naVarendeIndeks={props.naVarendeIndeks}
                    siderTilsammen={props.siderTilsammen}
                    sidetall={props.naVarendeIndeks}
                />
            </button>
            <button
                className={'sidebytter__valg'}
                onClick={() => byttSide(props.naVarendeIndeks + 1)}
            >
                <GraSirkelMedNr
                    siderTilsammen={props.siderTilsammen}
                    sidetall={props.naVarendeIndeks + 1}
                    naVarendeIndeks={props.naVarendeIndeks}
                />
            </button>
            {props.naVarendeIndeks < props.siderTilsammen - 1 && (
                <>
                    ...
                    <button
                        className={'sidebytter__valg'}
                        onClick={() => byttSide(props.siderTilsammen)}
                    >
                        <GraSirkelMedNr
                            naVarendeIndeks={props.naVarendeIndeks}
                            siderTilsammen={props.siderTilsammen}
                            sidetall={props.siderTilsammen}
                        />
                    </button>
                </>
            )}
        </>
    );
};

export default GenerellVisning;
