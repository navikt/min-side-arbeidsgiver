import React, { FunctionComponent } from 'react';
import { MenuItem } from 'react-aria-menubutton';

import { Organisasjon } from '../../../../../../Objekter/organisasjon';
import OrganisasjonsVisning from '../../../OrganisasjonsVisning/OrganisasjonsVisning';
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
            tabIndex={0}
            className={'underenhet-meny-valg'}
        >
            <OrganisasjonsVisning hovedOrganisasjon={underEnhet} className={'underenhet'} />
        </MenuItem>
    );
};

export default Underenhet;
