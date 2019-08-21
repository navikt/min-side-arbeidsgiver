import React, { FunctionComponent } from 'react';

import { Organisasjon, OverenhetOrganisasjon } from '../../../Objekter/organisasjon';
import Virksomhet from './Virksomhet/Virksomhet';
import Underenhet from './JuridiskEnhetMedUnderenheter/Underenhetsvelger/Underenhet/Underenhet';
import './JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter.less';

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
                    <Virksomhet erJuridiskEnhet hovedOrganisasjon={juridiskEnhet.overordnetOrg} />
                </div>
                {UnderOrganisasjonsMenyKomponenter}
            </>
        );
    });

    return <>{menyKomponenter}</>;
};

export default Sokeresultat;
