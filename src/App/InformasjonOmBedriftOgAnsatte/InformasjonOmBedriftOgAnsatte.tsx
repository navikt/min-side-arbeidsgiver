import React, { FunctionComponent, useContext, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import './InformasjonOmBedriftOgAnsatte.less';
import Lenke from 'nav-frontend-lenker';
import { basename } from '../../paths';
import Tabs from 'nav-frontend-tabs';

import Informasjon from './Informasjon/Informasjon';
import MineAnsatte from './MineAnsatte/MineAnsatte';

const InformasjonOmBedriftOgAnsatte: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const [visInfoEllerAnsatte, setVisInfoEllerAnsatte] = useState('informasjon');

    const setStateForVisning = (index: number) => {
        if (index === 0) {
            setVisInfoEllerAnsatte('informasjon');
        }
        if (index === 1) {
            setVisInfoEllerAnsatte('ansatte');
        }
    };

    return (
        <>
            {' '}
            <Lenke
                className={'tilbake-til-forsiden'}
                href={basename + '/' + valgtOrganisasjon.OrganizationNumber + '/'}
            >
                Tilbake til forsiden
            </Lenke>
            <div className="bedrift-og-ansatte-tab">
                <Tabs
                    tabs={[{ label: 'Informasjon om bedrift' }, { label: 'Mine ansatte' }]}
                    onChange={(event: any, index: number) => setStateForVisning(index)}
                    kompakt
                />
            </div>
            {visInfoEllerAnsatte === 'informasjon' && <Informasjon />}
            {visInfoEllerAnsatte === 'ansatte' && <MineAnsatte />}
        </>
    );
};

export default InformasjonOmBedriftOgAnsatte;
