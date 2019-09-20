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
        <div className={'sidebytter'}>
            <button className={'sidebytter__valg'} onClick={() => byttSide(1)}>
                <GraSirkelMedNr sidetall={1} />
            </button>
            ...
            <button
                className={'sidebytter__valg'}
                onClick={() => byttSide(props.naVarendeIndeks - 1)}
            >
                <GraSirkelMedNr sidetall={props.naVarendeIndeks - 1} />
            </button>
            <button className="sidebytter__valg erValgt">
                <GraSirkelMedNr sidetall={props.naVarendeIndeks} />
            </button>
            <button
                className={'sidebytter__valg'}
                onClick={() => byttSide(props.naVarendeIndeks + 1)}
            >
                <GraSirkelMedNr sidetall={props.naVarendeIndeks + 1} />
            </button>
            ...
            <button className={'sidebytter__valg'} onClick={() => byttSide(props.siderTilsammen)}>
                <GraSirkelMedNr sidetall={props.siderTilsammen} />
            </button>
        </div>
    );
};

export default GenerellVisning;
