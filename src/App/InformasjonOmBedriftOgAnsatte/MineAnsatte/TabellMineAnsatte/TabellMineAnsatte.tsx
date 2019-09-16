import React, { FunctionComponent, useContext } from 'react';
import './TabellMineAnsatte.less';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import KolonnerFullSkjerm from './Kolonner/KollonerFullSkjerm';

interface Props {
    className?: string;
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);

    const rader = mineAnsatte.map(arbeidsforhold => (
        <tr>
            <td className={'td'} tabIndex={0}>
                Kjell Magne
            </td>
            <td className={'td'} tabIndex={0}>
                {arbeidsforhold.arbeidstaker.offentligIdent}
            </td>
            <td className={'td'} tabIndex={0}>
                {arbeidsforhold.arbeidsavtaler[0].yrke}
            </td>
            <td className={'td'} tabIndex={0}>
                {arbeidsforhold.ansettelsesperiode.periode.fom}
            </td>
            <td className={'td'} tabIndex={0}>
                {arbeidsforhold.ansettelsesperiode.periode.tom}
            </td>
            <td className={'td'} tabIndex={0}>
                varslinger
            </td>
        </tr>
    ));

    return (
        <table id="arbeidsforholdTable" className={props.className}>
            <KolonnerFullSkjerm />

            {rader}
        </table>
    );
};

export default TabellMineAnsatte;
