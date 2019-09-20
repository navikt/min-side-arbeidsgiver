import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import './BlaIAnsatte.less';
import { enkelArbeidsforhold, ObjektFraAAregisteret } from '../../../../Objekter/Ansatte';
import GraSirkelMedNr from './GraSirkelMedNr/GraSirkelMedNr';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';

import ListeMedAnsatteForMobil from '../ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from '../TabellMineAnsatte/TabellMineAnsatte';
interface Props {
    className?: string;
    listeMedArbeidsForhold: ObjektFraAAregisteret;
    endreSideVisning: (indeks: number) => void;
}

const VisningAvSideBytter: FunctionComponent<Props> = props => {
    const [naVarendeIndex, setnaVarendeIndex] = useState(1);
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    const [listenSomSkalVises, setListenSomSkalVises] = useState([]);

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeIndex(indeks);
        const forsteElement: number = 25 * indeks - 24;
        const vise: any = mineAnsatte.arbeidsforholdoversikter.slice(
            forsteElement - 1,
            forsteElement + 24
        );
        setListenSomSkalVises(vise);
    };

    return (
        <>
            <div className={'sidebytter'}>
                <button className={'sidebytter__valg'} onClick={() => setIndeksOgGenererListe(1)}>
                    <GraSirkelMedNr sidetall={1} />
                </button>
                <button
                    className="sidebytter__valg erValgt"
                    onClick={() => setIndeksOgGenererListe(2)}
                >
                    <GraSirkelMedNr sidetall={2} />
                </button>
                <button className={'sidebytter__valg'} onClick={() => setIndeksOgGenererListe(3)}>
                    <GraSirkelMedNr sidetall={3} />
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

export default VisningAvSideBytter;
