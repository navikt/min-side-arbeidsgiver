import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';

import './JuridiskEnhet.less';
import { ReactComponent as JuridiskEnhetsikon } from './juridiskEnhet.svg';
import { JuridiskEnhetMedUnderEnheter } from '../../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';

interface Props {
    organisasjon: JuridiskEnhetMedUnderEnheter;
}

const JuridiskEnhet: FunctionComponent<Props> = props => {
    return (
        <div className="juridisk-enhet">
            <JuridiskEnhetsikon />
            <div className="juridisk-enhet__tekst">
                <Element>{props.organisasjon.JuridiskEnhet.Name}</Element>
                org. nr. {props.organisasjon.JuridiskEnhet.OrganizationNumber}
            </div>
        </div>
    );
};

export default JuridiskEnhet;
