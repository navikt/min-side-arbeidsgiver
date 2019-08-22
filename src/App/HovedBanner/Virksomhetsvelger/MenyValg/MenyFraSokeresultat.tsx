import React, { FunctionComponent } from 'react';

import { JuridiskEnhetMedUnderEnheterArray } from '../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import Underenhet from '../JuridiskEnhetMedUnderenheter/Underenhetsvelger/Underenhet/Underenhet';
import JuridiskEnhet from '../JuridiskEnhetMedUnderenheter/JuridiskEnhet/JuridiskEnhet';

export interface Props {
    ListeMedObjektFraSok: JuridiskEnhetMedUnderEnheterArray[];
}

const MenyFraSokeresultat: FunctionComponent<Props> = props => {
    const menyKomponenter = props.ListeMedObjektFraSok.map(juridiskEnhet => {
        const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.Underenheter.map(org => (
            <Underenhet key={org.Name} underEnhet={org} />
        ));

        return (
            <>
                <JuridiskEnhet organisasjon={juridiskEnhet} />
                {UnderOrganisasjonsMenyKomponenter}
            </>
        );
    });

    return <>{menyKomponenter}</>;
};

export default MenyFraSokeresultat;
