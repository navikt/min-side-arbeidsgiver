import React, { FunctionComponent } from 'react';
import { MenuItem } from 'react-aria-menubutton';

import { Organisasjon } from '../../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import Organisasjonsbeskrivelse from '../../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
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
            className={'underenhet'}
            tabIndex={0}
        >
            <Organisasjonsbeskrivelse
                navn={underEnhet.Name}
                orgnummer={underEnhet.OrganizationNumber}
            />
        </MenuItem>
    );
};

export default Underenhet;
