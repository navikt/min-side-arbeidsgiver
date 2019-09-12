import React, { FunctionComponent, useContext } from 'react';
import './TabellMineAnsatte.less';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import KolonnerFullSkjerm from './Kolonner/KollonerFullSkjerm';
import SkjulteKolonner from './Kolonner/SkjulteKolonnerForMobil';

interface Props {
    className?: string;
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);

    const rader = mineAnsatte.map(arbeidsforhold => (
        <tr className={'tr'} tabIndex={0}>
            <td className={'td'}>Kjell Magne</td>
            <td className={'td'}>{arbeidsforhold.arbeidstaker.offentligIdent}</td>
            <td className={'td'}>{arbeidsforhold.arbeidsavtaler[0].yrke}</td>
            <td className={'td'}>{arbeidsforhold.ansettelsesperiode.periode.fom}</td>
            <td className={'td'}>{arbeidsforhold.ansettelsesperiode.periode.tom}</td>
            <td className={'td'}>varslinger</td>
        </tr>
    ));

    return (
        <table id="arbeidsforholdTable" className={props.className}>
            <thead className="thead" tabIndex={0}>
                <KolonnerFullSkjerm />
                <SkjulteKolonner />
            </thead>
            {rader}
        </table>
    );
};

export default TabellMineAnsatte;
