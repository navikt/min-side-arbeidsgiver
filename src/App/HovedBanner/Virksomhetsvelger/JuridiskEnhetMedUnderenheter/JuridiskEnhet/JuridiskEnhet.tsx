import React, { FunctionComponent } from 'react';

import { JuridiskEnhetMedUnderEnheterArray } from '../../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import Organisasjonsbeskrivelse from '../../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import './JuridiskEnhet.less';

interface Props {
    organisasjon: JuridiskEnhetMedUnderEnheterArray;
}

const JuridiskEnhet: FunctionComponent<Props> = props => {
    const juridiskEnhet = props.organisasjon.JuridiskEnhet;

    return (
        <div className="juridisk-enhet">
            <Organisasjonsbeskrivelse
                erJuridiskEnhet
                navn={juridiskEnhet.Name}
                orgnummer={juridiskEnhet.OrganizationNumber}
            />
        </div>
    );
};

export default JuridiskEnhet;
