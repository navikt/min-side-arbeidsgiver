import React, { FunctionComponent } from 'react';

import { JuridiskEnhetMedUnderEnheter } from '../../../../Objekter/organisasjon';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import './JuridiskEnhetMedUnderenheter.less';
import JuridiskEnhet from './JuridiskEnhet/JuridiskEnhet';

interface Props {
    organisasjon: JuridiskEnhetMedUnderEnheter;
}

const JuridiskEnhetMedUnderenheter: FunctionComponent<Props> = props => {
    return (
        <>
            <JuridiskEnhet organisasjon={props.organisasjon} />
            <Underenhetsvelger hovedOrganisasjon={props.organisasjon} />
        </>
    );
};

export default JuridiskEnhetMedUnderenheter;
