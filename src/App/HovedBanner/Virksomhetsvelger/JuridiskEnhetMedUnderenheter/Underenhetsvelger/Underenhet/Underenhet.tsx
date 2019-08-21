import React, { FunctionComponent } from 'react';
import { MenuItem } from 'react-aria-menubutton';
import { Element } from 'nav-frontend-typografi';

import { Organisasjon } from '../../../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { ReactComponent as Underenhetsikon } from './underenhet-ikon.svg';
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
            <Underenhetsikon />
            <div className="underenhet__tekst">
                <Element>{underEnhet.Name}</Element>
                org. nr. {underEnhet.OrganizationNumber}
            </div>
        </MenuItem>
    );
};

export default Underenhet;
