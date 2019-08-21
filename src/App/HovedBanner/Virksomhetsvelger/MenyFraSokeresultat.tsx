import React, { FunctionComponent } from 'react';

import { Organisasjon, JuridiskEnhetMedUnderEnheter } from '../../../Objekter/organisasjon';
import Underenhet from './JuridiskEnhetMedUnderenheter/Underenhetsvelger/Underenhet/Underenhet';
import './JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter.less';
import JuridiskEnhet from './JuridiskEnhetMedUnderenheter/JuridiskEnhet/JuridiskEnhet';

export interface Props {
    ListeMedObjektFraSok: JuridiskEnhetMedUnderEnheter[];
}

const Sokeresultat: FunctionComponent<Props> = props => {
    const menyKomponenter = props.ListeMedObjektFraSok.map(function(
        juridiskEnhet: JuridiskEnhetMedUnderEnheter
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

export default Sokeresultat;
