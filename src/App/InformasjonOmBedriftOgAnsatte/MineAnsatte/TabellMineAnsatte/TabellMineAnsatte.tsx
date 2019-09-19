import React, { FunctionComponent, useContext } from 'react';
import './TabellMineAnsatte.less';
import KolonnerFullSkjerm from './Kolonner/KollonerFullSkjerm';
import { enkelArbeidsforhold, ObjektFraAAregisteret } from '../../../../Objekter/Ansatte';

interface Props {
    className?: string;
    listeMedArbeidsForhold: ObjektFraAAregisteret;
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
    let index: number = 0;
    const rader = props.listeMedArbeidsForhold.arbeidsforholdoversikter.map(arbeidsforhold => {
        index++;
        return (
            <tr>
                <td className={'td'} tabIndex={0}>
                    {arbeidsforhold.navn + index.toString()}
                </td>
                <td className={'td'} tabIndex={0}>
                    {arbeidsforhold.arbeidstaker.offentligIdent}
                </td>
                <td className={'td'} tabIndex={0}>
                    {arbeidsforhold.yrke}
                </td>
                <td className={'td'} tabIndex={0}>
                    {arbeidsforhold.ansattFom}
                </td>
                <td className={'td'} tabIndex={0}>
                    {arbeidsforhold.ansattTom}
                </td>
                <td className={'td'} tabIndex={0}>
                    varslinger
                </td>
            </tr>
        );
    });

    return (
        <table id="arbeidsforholdTable" className={props.className}>
            <KolonnerFullSkjerm />
            {rader}
        </table>
    );
};

export default TabellMineAnsatte;
