import React, { FunctionComponent } from 'react';

import {
    Organisasjon,
    JuridiskEnhetMedUnderEnheterArray,
} from '../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import Underenhet from '../JuridiskEnhetMedUnderenheter/Underenhetsvelger/Underenhet/Underenhet';
import '../JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter.less';
import JuridiskEnhet from '../JuridiskEnhetMedUnderenheter/JuridiskEnhet/JuridiskEnhet';

export interface Props {
    ListeMedObjektFraSok: JuridiskEnhetMedUnderEnheterArray[];
}

const MenyFraSokeresultat: FunctionComponent<Props> = props => {
    const menyKomponenter = props.ListeMedObjektFraSok.map(function(
        juridiskEnhet: JuridiskEnhetMedUnderEnheterArray
    ) {
        const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.Underenheter.map(function(
            org: Organisasjon
        ) {
            return <Underenhet underEnhet={org} />;
        });
        return (
            <>
                <div>
                    <JuridiskEnhet organisasjon={juridiskEnhet} />
                </div>
                {UnderOrganisasjonsMenyKomponenter}
            </>
        );
    });

    return <>{menyKomponenter}</>;
};

export default MenyFraSokeresultat;
