import React, { FunctionComponent } from 'react';
import './Ansatt.less';

import { enkelArbeidsforhold } from '../../../../../../Objekter/Ansatte';

interface Props {
    className?: string;
    arbeidsforhold: enkelArbeidsforhold;
}

const Ansatt: FunctionComponent<Props> = props => {
    return (
        <li>
            {' '}
            id="arbeidsforholdTable" ><div className="arbeidsforhold" />
        </li>
    );
};

export default Ansatt;
