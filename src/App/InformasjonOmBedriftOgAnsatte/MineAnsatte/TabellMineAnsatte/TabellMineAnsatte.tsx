import React, { FunctionComponent, useContext } from 'react';
import './TabellMineAnsatte.less';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';

interface Props {
    className?: string;
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);

    const rader = mineAnsatte.map(arbeidsforhold => (
        <tr className={'tr'} tabIndex={0}>
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
        <table id="arbeidsforholdTable" className={props.className} tabIndex={0}>
            <thead className="thead" tabIndex={0}>
                <tr>
                    <th className={'th'} tabIndex={0}>
                        Navn
                    </th>
                    <th className={'th'} tabIndex={0}>
                        Fødselsnummer
                    </th>
                    <th className={'th'} tabIndex={0}>
                        Yrke
                    </th>
                    <th className={'th'} tabIndex={0}>
                        Startdato
                    </th>
                    <th className={'th'} tabIndex={0}>
                        Sluttdato
                    </th>
                    <th className={'th'} tabIndex={0}>
                        Varsel
                    </th>
                </tr>
            </thead>
            {rader}
        </table>
    );
};

export default TabellMineAnsatte;
