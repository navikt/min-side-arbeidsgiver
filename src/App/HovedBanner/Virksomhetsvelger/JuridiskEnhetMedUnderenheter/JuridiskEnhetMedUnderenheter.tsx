import React, { FunctionComponent } from 'react';

import { OverenhetOrganisasjon } from '../../../../Objekter/organisasjon';
import Virksomhet from '../Virksomhet/Virksomhet';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import './JuridiskEnhetMedUnderenheter.less';

interface Props {
    className: string;
    organisasjon: OverenhetOrganisasjon;
}

const JuridiskEnhetMedUnderenheter: FunctionComponent<Props> = props => {
    return (
        <div className={props.className}>
            <Virksomhet erJuridiskEnhet hovedOrganisasjon={props.organisasjon.overordnetOrg} />
            <Underenhetsvelger hovedOrganisasjon={props.organisasjon} />
        </div>
    );
};

export default JuridiskEnhetMedUnderenheter;
