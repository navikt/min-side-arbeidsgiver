import React, { FunctionComponent } from 'react';
import { JuridiskEnhetMedUnderEnheterArray } from '../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import JuridiskEnhetMedUnderenheter from '../JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter';

interface Props {
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[];
}

const DefaultMeny: FunctionComponent<Props> = props => {
    const organisasjonsMenyKomponenter = props.menyKomponenter.map(function(organisasjon) {
        return <JuridiskEnhetMedUnderenheter organisasjon={organisasjon} />;
    });
    return <>{organisasjonsMenyKomponenter}</>;
};
export default DefaultMeny;
