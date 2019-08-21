import React, { FunctionComponent } from 'react';

import { OverenhetOrganisasjon } from '../../../../Objekter/organisasjon';
import { Element } from 'nav-frontend-typografi';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import './JuridiskEnhetMedUnderenheter.less';
import { ReactComponent as JuridiskEnhetsikon } from '../Virksomhet/juridiskEnhet.svg';

interface Props {
    organisasjon: OverenhetOrganisasjon;
}

const JuridiskEnhetMedUnderenheter: FunctionComponent<Props> = props => {
    return (
        <>
            <div className="juridisk-enhet">
                <JuridiskEnhetsikon />
                <div className="juridisk-enhet__tekst">
                    <Element>{props.organisasjon.overordnetOrg.Name}</Element>
                    org. nr. {props.organisasjon.overordnetOrg.OrganizationNumber}
                </div>
            </div>
            <Underenhetsvelger hovedOrganisasjon={props.organisasjon} />
        </>
    );
};

export default JuridiskEnhetMedUnderenheter;
