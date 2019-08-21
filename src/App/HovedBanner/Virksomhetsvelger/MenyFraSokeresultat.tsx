import React, { FunctionComponent } from 'react';

import { Organisasjon, OverenhetOrganisasjon } from '../../../Objekter/organisasjon';
import Underenhet from './JuridiskEnhetMedUnderenheter/Underenhetsvelger/Underenhet/Underenhet';
import './JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter.less';
import JuridiskEnhet from './JuridiskEnhetMedUnderenheter/JuridiskEnhet/JuridiskEnhet';

export interface Props {
    ListeMedObjektFraSok: OverenhetOrganisasjon[];
}

const Sokeresultat: FunctionComponent<Props> = props => {
    const menyKomponenter = props.ListeMedObjektFraSok.map(function(
        juridiskEnhet: OverenhetOrganisasjon
    ) {
        const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.UnderOrganisasjoner.map(function(
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

export default Sokeresultat;
