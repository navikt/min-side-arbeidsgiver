import React, { FunctionComponent } from 'react';

import { Organisasjon, OverenhetOrganisasjon } from '../../../../Objekter/organisasjon';
import OrganisasjonsVisning from '../OrganisasjonsVisning/OrganisasjonsVisning';
import Underenhet from '../JuridiskEnhetMedUnderenheter/Underenhetsvelger/Underenhet/Underenhet';
import '../JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter.less';

export interface Props {
    ListeMedObjektFraSok: OverenhetOrganisasjon[];
}

const MenyEtterSok: FunctionComponent<Props> = props => {
    const menyKomponenter = props.ListeMedObjektFraSok.map(function(
        juridiskEnhet: OverenhetOrganisasjon
    ) {
        const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.UnderOrganisasjoner.map(function(
            org: Organisasjon
        ) {
            return <Underenhet underEnhet={org} />;
        });

        return (
            <div className={'meny-objekt__objekt-etter-sok'}>
                <div className={'meny-objekt__juridisk-enhet  etter-sok'}>
                    <OrganisasjonsVisning
                        hovedOrganisasjon={juridiskEnhet.overordnetOrg}
                        className={'meny-objekt__juridisk-enhet'}
                    />
                </div>
                {UnderOrganisasjonsMenyKomponenter}
            </div>
        );
    });

    return <>{menyKomponenter}</>;
};

export default MenyEtterSok;
