import React, { FunctionComponent } from 'react';
import { MenuItem } from 'react-aria-menubutton';

import { Organisasjon } from '../../../../../../Objekter/organisasjon';
import Virksomhet from '../../../Virksomhet/Virksomhet';
import './Underenhet.less';

interface Props {
    className?: string;
    underEnhet: Organisasjon;
}

const Underenhet: FunctionComponent<Props> = ({ underEnhet }) => {
    return (
        <MenuItem
            key={underEnhet.OrganizationNumber}
            value={underEnhet.OrganizationNumber}
            text={underEnhet.Name}
            tag="button"
            className={'underenhet-meny-valg'}
        >
            <Virksomhet hovedOrganisasjon={underEnhet} />
        </MenuItem>
    );
};

export default Underenhet;
