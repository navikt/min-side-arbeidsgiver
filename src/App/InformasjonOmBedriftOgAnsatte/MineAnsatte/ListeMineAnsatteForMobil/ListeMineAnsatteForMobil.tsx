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
        <Ansatt arbeidsforhold={forhold} />
    ));

    return <ul className={props.className}> {rader} </ul>;
};

export default ListeMedAnsatteForMobil;
