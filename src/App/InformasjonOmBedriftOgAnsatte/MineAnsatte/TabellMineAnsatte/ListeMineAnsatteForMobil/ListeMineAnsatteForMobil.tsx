import React, { FunctionComponent, useContext } from 'react';
import './TabellMineAnsatte.less';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';

interface Props {
    className?: string;
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = props => {
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

    return <table id="arbeidsforholdTable" className={props.className} />;
};

export default ListeMedAnsatteForMobil;
