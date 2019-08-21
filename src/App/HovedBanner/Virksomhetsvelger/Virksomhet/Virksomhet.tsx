import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';

import { Organisasjon } from '../../../../Objekter/organisasjon';
import bedriftsikon from './bedriftsikon.svg';
import hvittbedriftsikon from './hvit-bedrift.svg';
import underenhethvit from './hvit-underenhet.svg';
import underenhetikon from './underenhet-ikon.svg';
import './Virksomhet.less';

interface Props {
    erJuridiskEnhet?: boolean;
    hovedOrganisasjon: Organisasjon;
}

const Virksomhet: FunctionComponent<Props> = ({ erJuridiskEnhet, hovedOrganisasjon }) => {
    const className = 'virksomhet' + (erJuridiskEnhet ? ' virksomhet--juridiskEnhet' : '');

    return (
        <div className={className}>
            <img
                alt={'ikon for bedrift'}
                className="virksomhet__bedrifts-ikon"
                src={bedriftsikon}
            />
            <img
                alt={'ikon for underenhet'}
                className="virksomhet__underenhet-ikon"
                src={underenhetikon}
            />
            <img
                alt={'ikon for underenhet'}
                className="virksomhet__underenhet-hvit"
                src={underenhethvit}
            />
            <img alt={'hvitt ikon'} className="virksomhet__hvitt-ikon" src={hvittbedriftsikon} />
            <div className="virksomhet__tekst">
                <Element>{hovedOrganisasjon.Name}</Element>
                org. nr. {hovedOrganisasjon.OrganizationNumber}
            </div>
        </div>
    );
};

export default Virksomhet;
