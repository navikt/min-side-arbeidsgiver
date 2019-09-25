import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import './MineAnsatte.less';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import SideBytter from './SideBytter/SideBytter';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';

const MineAnsatte: FunctionComponent = () => {
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    const [listenSomSkalVises, setListenSomSkalVises] = useState([]);
    const [antallSider, setAntallSider] = useState(0);
    const [naVarendeIndex, setnaVarendeIndex] = useState(1);

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeIndex(indeks);
        console.log('indeks som settes: ', indeks);
    };

    useEffect(() => {
        console.log(mineAnsatte.arbeidsforholdoversikter.length);
        const forsteElement: number = 25 * naVarendeIndex - 24;
        const vise: any = mineAnsatte.arbeidsforholdoversikter.slice(
            forsteElement - 1,
            forsteElement + 24
        );
        setListenSomSkalVises(vise);
        let antallSider: number = Math.floor(mineAnsatte.arbeidsforholdoversikter.length / 25);
        if (mineAnsatte.arbeidsforholdoversikter.length % 25 !== 0) {
            antallSider++;
        }
        setAntallSider(antallSider);
    }, [mineAnsatte.arbeidsforholdoversikter, naVarendeIndex]);
    return (
        <div className={'mine-ansatte'}>
            <div className={'mine-ansatte__topp'}>
                <Undertittel className={'mine-ansatte__systemtittel'} tabIndex={0}>
                    Opplysninger fra Aa-registeret
                </Undertittel>
                <SideBytter
                    className={'sidebytter'}
                    byttSide={setIndeksOgGenererListe}
                    arbeidsforhold={mineAnsatte}
                    antallSider={antallSider}
                    naVarendeIndeks={naVarendeIndex}
                />
            </div>

            <TabellMineAnsatte
                className={'mine-ansatte__table'}
                listeMedArbeidsForhold={listenSomSkalVises}
            />
            <ListeMedAnsatteForMobil
                listeMedArbeidsForhold={listenSomSkalVises}
                className={'mine-ansatte__liste'}
            />
        </div>
    );
};

export default MineAnsatte;
