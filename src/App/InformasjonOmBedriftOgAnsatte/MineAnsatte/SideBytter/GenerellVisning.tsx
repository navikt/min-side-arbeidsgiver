import React, { FunctionComponent } from 'react';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';
interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    naVarendeIndeks: number;
    siderTilsammen: number;
}

const GenerellVisning: FunctionComponent<Props> = props => {
    return (
        <>
            <GraSirkelMedNr
                naVarendeIndeks={props.naVarendeIndeks}
                siderTilsammen={props.siderTilsammen}
                sidetall={1}
                byttSide={props.byttSide}
            />
            ...
            <GraSirkelMedNr
                naVarendeIndeks={props.naVarendeIndeks}
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks - 1}
                byttSide={props.byttSide}
            />
            <GraSirkelMedNr
                naVarendeIndeks={props.naVarendeIndeks}
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks}
                byttSide={props.byttSide}
            />
            <GraSirkelMedNr
                siderTilsammen={props.siderTilsammen}
                sidetall={props.naVarendeIndeks + 1}
                naVarendeIndeks={props.naVarendeIndeks}
                byttSide={props.byttSide}
            />
            {props.naVarendeIndeks < props.siderTilsammen - 1 && (
                <>
                    ...
                    <GraSirkelMedNr
                        naVarendeIndeks={props.naVarendeIndeks}
                        siderTilsammen={props.siderTilsammen}
                        sidetall={props.siderTilsammen}
                        byttSide={props.byttSide}
                    />
                </>
            )}
        </>
    );
};

export default GenerellVisning;
