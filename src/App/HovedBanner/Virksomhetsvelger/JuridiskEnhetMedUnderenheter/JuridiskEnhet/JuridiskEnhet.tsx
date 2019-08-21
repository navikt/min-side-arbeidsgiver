import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';

import './JuridiskEnhet.less';
import { ReactComponent as JuridiskEnhetsikon } from './juridiskEnhet.svg';
import { OverenhetOrganisasjon } from '../../../../../Objekter/organisasjon';

interface Props {
    organisasjon: OverenhetOrganisasjon;
}

const JuridiskEnhet: FunctionComponent<Props> = props => {
    return (
        <div className="juridisk-enhet">
            <JuridiskEnhetsikon />
            <div className="juridisk-enhet__tekst">
                <Element>{props.organisasjon.overordnetOrg.Name}</Element>
                org. nr. {props.organisasjon.overordnetOrg.OrganizationNumber}
            </div>
        </div>
    );
};

export default JuridiskEnhet;
