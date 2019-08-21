import React, { FunctionComponent } from 'react';

import { JuridiskEnhetMedUnderEnheterArray } from '../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import './JuridiskEnhetMedUnderenheter.less';
import JuridiskEnhet from './JuridiskEnhet/JuridiskEnhet';

interface Props {
    organisasjon: JuridiskEnhetMedUnderEnheterArray;
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
