import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { Enhet, hentOverordnetEnhet, hentUnderenhet } from '../../api/enhetsregisteretApi';
import Underenhet from './Underenhet/Underenhet';
import OverordnetEnhet from './OverordnetEnhet/OverordnetEnhet';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './InformasjonOmBedrift.css';
import { Panel } from '@navikt/ds-react';

export interface Enheter {
    underenhet: Enhet;
    hovedenhet: Enhet;
}

const hentEnheter = async (orgnr: string): Promise<Enheter | undefined> => {
    const underenhet = await hentUnderenhet(orgnr);
    if (underenhet === undefined) {
        return undefined;
    }
    if (underenhet.overordnetEnhet === undefined) {
        return undefined;
    }
    const hovedenhet = await hentOverordnetEnhet(underenhet.overordnetEnhet);
    if (hovedenhet === undefined) {
        return undefined;
    }
    return { underenhet, hovedenhet };
};

const Kontaktpanel = ({ children }: { children: React.ReactNode }) => (
    <Panel className="informasjon-om-bedrift">{children}</Panel>
);

const InformasjonOmBedrift: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [enheter, setEnheter] = useState<Enheter | undefined>(undefined);
    const orgnr = valgtOrganisasjon?.organisasjon.OrganizationNumber;

    useEffect(() => {
        if (orgnr !== undefined) {
            hentEnheter(orgnr).then(setEnheter);
        } else {
            setEnheter(undefined);
        }
    }, [orgnr]);

    return (
        <>
            <Brodsmulesti
                brodsmuler={[
                    { url: '/bedriftsinformasjon', title: 'Bedriftsprofil', handleInApp: true },
                ]}
            />
            {enheter !== undefined ? (
                <div className="">
                    <Kontaktpanel>
                        <Underenhet underenhet={enheter.underenhet} />
                    </Kontaktpanel>
                    <Kontaktpanel>
                        <OverordnetEnhet enheter={enheter} />
                    </Kontaktpanel>
                </div>
            ) : (
                <Kontaktpanel>
                    <div>Kunne ikke hente informasjon</div>
                </Kontaktpanel>
            )}
        </>
    );
};

export default InformasjonOmBedrift;
