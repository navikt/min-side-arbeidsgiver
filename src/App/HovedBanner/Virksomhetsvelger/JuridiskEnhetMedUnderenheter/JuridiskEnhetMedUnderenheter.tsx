import React, { FunctionComponent } from 'react';
import { MenuItem } from 'react-aria-menubutton';

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
            <MenuItem value={props.organisasjon} />
            <Underenhetsvelger hovedOrganisasjon={props.organisasjon} />
        </div>
    );
};

export default JuridiskEnhetMedUnderenheter;
