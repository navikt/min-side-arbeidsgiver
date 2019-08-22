import React, { FunctionComponent } from 'react';
import { JuridiskEnhetMedUnderEnheterArray } from '../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import JuridiskEnhetMedUnderenheter from '../JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter';

interface Props {
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[];
}

const DefaultMeny: FunctionComponent<Props> = ({ menyKomponenter }) => (
    <>
        {menyKomponenter.map(organisasjon => (
            <JuridiskEnhetMedUnderenheter
                key={organisasjon.JuridiskEnhet.Name}
                organisasjon={organisasjon}
            />
        ))}
    </>
);

export default DefaultMeny;
