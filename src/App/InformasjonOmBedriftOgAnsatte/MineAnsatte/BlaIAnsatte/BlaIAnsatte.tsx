import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import './BlaIAnsatte.less';
import {
    enkelArbeidsforhold,
    Mocksrespons,
    ObjektFraAAregisteret,
} from '../../../../Objekter/Ansatte';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';

import ListeMedAnsatteForMobil from '../ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import TabellMineAnsatte from '../TabellMineAnsatte/TabellMineAnsatte';

export const sjekkAntallSider = (liste: enkelArbeidsforhold[], antallForhold: number) => {
    let antallSider: number = Math.floor(liste.length / antallForhold);
    if (liste.length % antallForhold !== 0) {
        antallSider++;
    }
    return antallSider;
};

export const genererListe = (
    indeks: number,
    liste: ObjektFraAAregisteret,
    antallForhold: number
) => {
    let forsteElement: number = antallForhold * indeks;
    return liste.arbeidsforholdoversikter.slice(forsteElement, indeks + antallForhold + 1);
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
    listeMedArbeidsForhold: ObjektFraAAregisteret;
}

const SideBytter: FunctionComponent<Props> = props => {
    const [naVarendeIndex, setnaVarendeIndex] = useState(1);
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    const [ListenSomSkalVises, setListenSomSkalVises] = useState(
        mineAnsatte.arbeidsforholdoversikter
    );

    const setIndexOgGenererListe = (indeks: number) => {
        setnaVarendeIndex(indeks);
        let forsteElement: number = 25 * indeks;
        mineAnsatte.arbeidsforholdoversikter.slice(forsteElement, indeks + 25 + 1);
        const vise: any = mineAnsatte.arbeidsforholdoversikter.slice(
            forsteElement,
            indeks + 25 + 1
        );
        setListenSomSkalVises(vise);
    };

    return (
        <>
            <div className={'sidebytter'}>
                <button className={'sidebytter__valg'} onClick={() => setIndexOgGenererListe(1)}>
                    <GraSirkelMedNr sidetall={1} />
                </button>
                ...
                <button
                    className={'sidebytter__valg'}
                    onClick={() => setIndeksOgGenererListe(naVarendeIndex - 1)}
                >
                    <GraSirkelMedNr sidetall={naVarendeIndex - 1} />
                </button>
                <button className="sidebytter__valg erValgt">
                    <GraSirkelMedNr sidetall={naVarendeIndex} />
                </button>
                <button
                    className={'sidebytter__valg'}
                    onClick={() => setIndeksOgGenererListe(naVarendeIndex + 1)}
                >
                    <GraSirkelMedNr sidetall={naVarendeIndex + 1} />
                </button>
                ...
                <button className={'sidebytter__valg'} onClick={() => setIndeksOgGenererListe(72)}>
                    <GraSirkelMedNr sidetall={72} />
                </button>
            </div>

            <TabellMineAnsatte
                className={'mine-ansatte__table'}
                listeMedArbeidsForhold={mineAnsatte}
            />
            <ListeMedAnsatteForMobil
                listeMedArbeidsForhold={mineAnsatte}
                className={'mine-ansatte__liste'}
            />
        </>
    );
};

export default SideBytter;
