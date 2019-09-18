import React, { FunctionComponent, useState, useEffect } from 'react';
import './BlaIAnsatte.less';
import { enkelArbeidsforhold } from '../../../../Objekter/Ansatte';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';

export const sjekkAntallSider = (liste: enkelArbeidsforhold[], antallForhold: number) => {
    let antallSider: number = Math.floor(liste.length / antallForhold);
    if (liste.length % antallForhold !== 0) {
        antallSider++;
    }
    return antallSider;
};

export const genererListe = (
    indeks: number,
    liste: enkelArbeidsforhold[],
    antallForhold: number
) => {
    return liste.slice(indeks, indeks + antallForhold + 1);
};

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
    listeMedArbeidsForhold: enkelArbeidsforhold[];
}

const SideBytter: FunctionComponent<Props> = props => {
    const [naVarendeIndex, setnaVarendeIndex] = useState(1);

    return (
        <div className="sidebytter">
            <button className="sidebytter__valg" onClick={() => setnaVarendeIndex(1)}>
                <GraSirkelMedNr sidetall={1} />
            </button>
            ...
            <button
                className="sidebytter__valg"
                onClick={() => setnaVarendeIndex(naVarendeIndex - 1)}
            >
                <GraSirkelMedNr sidetall={naVarendeIndex - 1} />
            </button>
            <button className="sidebytter__valg">
                <GraSirkelMedNr sidetall={naVarendeIndex} erValgt={' ' + 'erValgt'} />
            </button>
            <button
                className="sidebytter__valg"
                onClick={() => setnaVarendeIndex(naVarendeIndex + 1)}
            >
                <GraSirkelMedNr sidetall={naVarendeIndex + 1} />
            </button>
            ...
            <button className="sidebytter__valg" onClick={() => setnaVarendeIndex(72)}>
                <GraSirkelMedNr sidetall={72} />
            </button>
        </div>
    );
};

export default SideBytter;
