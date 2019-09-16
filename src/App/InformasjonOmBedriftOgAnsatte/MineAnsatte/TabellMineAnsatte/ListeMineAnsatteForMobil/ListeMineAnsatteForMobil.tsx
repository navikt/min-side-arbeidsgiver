import React, { FunctionComponent } from 'react';
import './ListeMineAnsatteForMobil.less';
import { enkelArbeidsforhold } from '../../../../../Objekter/Ansatte';
import Ansatt from './Ansatt/Ansatt';
interface Props {
    className?: string;
    listeMedArbeidsForhold: enkelArbeidsforhold[];
}

const ListeMedAnsatteForMobil: FunctionComponent<Props> = props => {
    const rader = props.listeMedArbeidsForhold.map(forhold => <Ansatt arbeidsforhold={forhold} />);

    return <ul className={props.className}> {rader} </ul>;
};

export default ListeMedAnsatteForMobil;
