import React, { FunctionComponent } from 'react';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';
import './GraSirkelMedNr/GraSirkelMedNr.less';
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
            <GraSirkelMedNr
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
                byttSide={props.byttSide}
            />
            ...
            <GraSirkelMedNr
                byttSide={props.byttSide}
                naVarendeIndeks={props.naVarendeIndeks}
                sidetall={props.siderTilsammen - 2}
                siderTilsammen={props.siderTilsammen}
            />
            <GraSirkelMedNr
                byttSide={props.byttSide}
                sidetall={props.siderTilsammen - 1}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
            />
            <GraSirkelMedNr
                byttSide={props.byttSide}
                sidetall={props.siderTilsammen}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={props.naVarendeIndeks}
            />
        </>
    );
};

export default TreSiste;
