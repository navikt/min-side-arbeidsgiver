import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';

import { Organisasjon } from '../../../../Objekter/organisasjon';
import { ReactComponent as JuridiskEnhetsikon } from './juridiskEnhet.svg';
import { ReactComponent as Virksomhetsikon } from './virksomhet.svg';
import './Virksomhet.less';

interface Props {
    erJuridiskEnhet?: boolean;
    hovedOrganisasjon: Organisasjon;
}

const Virksomhet: FunctionComponent<Props> = ({ erJuridiskEnhet, hovedOrganisasjon }) => {
    const className = 'virksomhet' + (erJuridiskEnhet ? ' virksomhet--juridiskEnhet' : '');

    return (
        <>
            {erJuridiskEnhet ? <JuridiskEnhetsikon /> : <Virksomhetsikon />}
            <div className="virksomhet__tekst">
                <Element>{hovedOrganisasjon.Name}</Element>
                org. nr. {hovedOrganisasjon.OrganizationNumber}
            </div>
        </>
    );
};

export default Virksomhet;
