import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { hentOverordnetEnhet, hentUnderenhet } from '../../api/enhetsregisteretApi';
import {
    OrganisasjonFraEnhetsregisteret,
} from '../../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import Underenhet from './Underenhet/Underenhet';
import OverordnetEnhet from './OverordnetEnhet/OverordnetEnhet';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './InformasjonOmBedrift.less';

const InformasjonOmBedrift: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [underenhet, setUnderenhet] = useState<OrganisasjonFraEnhetsregisteret | undefined>(undefined);
    const [overordnetEnhet, setOverordnetEnhet] = useState<OrganisasjonFraEnhetsregisteret | undefined>(
        undefined,
    );
    const orgnr = valgtOrganisasjon?.organisasjon.OrganizationNumber ?? '';

    useEffect(() => {
        if (orgnr !== '') {
            hentUnderenhet(orgnr).then(
                underenhetRespons => {
                    setUnderenhet(underenhetRespons);
                    hentOverordnetEnhet(underenhetRespons.overordnetEnhet).then(
                        overordnetEnhetRespons => setOverordnetEnhet(overordnetEnhetRespons));
                },
            ).catch((e) => {
                setUnderenhet(undefined);
                setOverordnetEnhet(undefined);
                console.log(e);
            });
        }
    }, [orgnr]);

    return (
        <>
            <Brodsmulesti brodsmuler={[{ url: '/bedriftsinformasjon', title: 'Bedriftsprofil', handleInApp: true }]} />
            <div className='informasjon-om-bedrift'>
                <div className='informasjon-om-bedrift__hvitboks'>
                    {underenhet !== undefined && overordnetEnhet !== undefined ? (
                        <div className='informasjon-om-bedrift__info'>
                            <Underenhet underenhet={underenhet} />
                            her hvis underenhet er undefined
                            <OverordnetEnhet overordnetenhet={overordnetEnhet} />
                        </div>
                    ) : (
                        <div>Kunne ikke hente informasjon</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default InformasjonOmBedrift;