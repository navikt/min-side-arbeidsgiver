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
