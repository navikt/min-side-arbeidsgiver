import React, { FunctionComponent } from 'react';
import './ListeMineAnsatteForMobil.less';
import Ansatt from './Ansatt/Ansatt';
import { enkelArbeidsforhold, ObjektFraAAregisteret } from '../../../../Objekter/Ansatte';

interface Props {
    className?: string;
    listeMedArbeidsForhold: ObjektFraAAregisteret;
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = props => {
    const rader = props.listeMedArbeidsForhold.arbeidsforholdoversikter.map(forhold => (
        <Ansatt
            navn={forhold.navn}
            fom={forhold.ansattFom}
            tom={forhold.ansattTom}
            offentligID={forhold.arbeidstaker.offentligIdent}
            yrke={forhold.yrke}
        />
    ));

    return <ul className={props.className}> {rader} </ul>;
};

export default ListeMedAnsatteForMobil;
