import React, { FunctionComponent, useState, useEffect } from 'react';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';
import './GraSirkelMedNr/GraSirkelMedNr.less';
interface Props {
    className?: string;
    byttSide: (indeks: number) => void;
    siderTilsammen: number;
    naVarendeIndeks: number;
}

const TreEllerMindre: FunctionComponent<Props> = props => {
    const { byttSide } = props;
    const [naVarendeIndeks, setNaVarendeIndeks] = useState(props.naVarendeIndeks);

    useEffect(() => {
        setNaVarendeIndeks(props.naVarendeIndeks);
    }, [props.naVarendeIndeks]);

    return (
        <>
            <GraSirkelMedNr
                naVarendeIndeks={naVarendeIndeks}
                sidetall={1}
                siderTilsammen={props.siderTilsammen}
                byttSide={props.byttSide}
            />

            <GraSirkelMedNr
                sidetall={2}
                siderTilsammen={props.siderTilsammen}
                naVarendeIndeks={naVarendeIndeks}
                byttSide={props.byttSide}
            />

            {props.siderTilsammen > 2 && (
                <GraSirkelMedNr
                    sidetall={3}
                    siderTilsammen={props.siderTilsammen}
                    naVarendeIndeks={naVarendeIndeks}
                    byttSide={props.byttSide}
                />
            )}
            {props.siderTilsammen > 3 && (
                <>
                    ...
                    <GraSirkelMedNr
                        sidetall={props.siderTilsammen}
                        siderTilsammen={props.siderTilsammen}
                        naVarendeIndeks={props.naVarendeIndeks}
                        byttSide={props.byttSide}
                    />
                </>
            )}
        </>
    );
};

export default TreEllerMindre;
