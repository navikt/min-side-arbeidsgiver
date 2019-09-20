import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import './BlaIAnsatte.less';
import { enkelArbeidsforhold, ObjektFraAAregisteret } from '../../../../Objekter/Ansatte';
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
}

const SideBytter: FunctionComponent<Props> = props => {
    const [naVarendeIndex, setnaVarendeIndex] = useState(1);
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    const [listenSomSkalVises, setListenSomSkalVises] = useState([]);
    const [antallSiderCase, setantallSiderCase] = useState('<4');

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeIndex(indeks);
        const forsteElement: number = 25 * indeks - 24;
        const vise: any = mineAnsatte.arbeidsforholdoversikter.slice(
            forsteElement - 1,
            forsteElement + 24
        );
        setListenSomSkalVises(vise);
    };

    useEffect(() => {
        let antallSider: number = Math.floor(mineAnsatte.arbeidsforholdoversikter.length / 25);
        if (mineAnsatte.arbeidsforholdoversikter.length % 25 !== 0) {
            antallSider++;
        }
        if (antallSider > 4) {
            setantallSiderCase('<4');
        }
        if (naVarendeIndex > antallSider - 1) {
        }
    }, []);

    return (
        <>
            <div className={'sidebytter'}>
                <button className={'sidebytter__valg'} onClick={() => setIndeksOgGenererListe(1)}>
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
                listeMedArbeidsForhold={listenSomSkalVises}
            />
            <ListeMedAnsatteForMobil
                listeMedArbeidsForhold={listenSomSkalVises}
                className={'mine-ansatte__liste'}
            />
        </>
    );
};

export default SideBytter;
