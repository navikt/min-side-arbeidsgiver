import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {OrganisasjonsDetaljerContext} from '../OrganisasjonDetaljerProvider';
import {hentOverordnetEnhet, hentUnderenhet} from '../../api/enhetsregisteretApi';
import {
    OrganisasjonFraEnhetsregisteret,
    tomEnhetsregOrg,
} from '../../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import Underenhet from './Underenhet/Underenhet';
import OverordnetEnhet from './OverordnetEnhet/OverordnetEnhet';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './InformasjonOmBedrift.less';

const InformasjonOmBedrift: FunctionComponent = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const [underenhet, setUnderenhet] = useState<OrganisasjonFraEnhetsregisteret>(tomEnhetsregOrg);
    const [overordnetEnhet, setOverordnetEnhet] = useState<OrganisasjonFraEnhetsregisteret>(
        tomEnhetsregOrg
    );
    const orgnr = valgtOrganisasjon?.organisasjon.OrganizationNumber ?? '';

    useEffect(() => {
        const setEnheter = async () => {
            if (orgnr !== '') {
                setUnderenhet(await hentUnderenhet(orgnr));
                setOverordnetEnhet(await hentOverordnetEnhet(underenhet.overordnetEnhet));
            }
        };
        setEnheter();
    }, [orgnr, underenhet.overordnetEnhet]);

    return (
        <>
            <Brodsmulesti brodsmuler={[{url: '/bedriftsinformasjon', title: 'Bedriftsprofil', handleInApp: true}]}/>
            <div className="informasjon-om-bedrift">
                <div className="informasjon-om-bedrift__hvitboks">
                    {underenhet !== tomEnhetsregOrg ? (
                        <div className="informasjon-om-bedrift__info">
                            <Underenhet underenhet={underenhet}/>
                            <OverordnetEnhet overordnetenhet={overordnetEnhet}/>
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