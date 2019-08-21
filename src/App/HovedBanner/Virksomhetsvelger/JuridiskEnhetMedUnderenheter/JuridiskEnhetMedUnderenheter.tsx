import React, { FunctionComponent } from 'react';
import { MenuItem } from 'react-aria-menubutton';

import { OverenhetOrganisasjon } from '../../../../Objekter/organisasjon';
import OrganisasjonsVisning from '../OrganisasjonsVisning/OrganisasjonsVisning';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import './JuridiskEnhetMedUnderenheter.less';

interface Props {
    className: string;
    organisasjon: OverenhetOrganisasjon;
}

const JuridiskEnhetMedUnderenheter: FunctionComponent<Props> = props => {
    return (
        <div className={props.className}>
            <OrganisasjonsVisning
                hovedOrganisasjon={props.organisasjon.overordnetOrg}
                className={'juridisk-enhet'}
            />
            <MenuItem value={props.organisasjon} />
            <Underenhetsvelger hovedOrganisasjon={props.organisasjon} />
        </div>
    );
};

export default JuridiskEnhetMedUnderenheter;
