import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { useOverordnetEnhet, useUnderenhet } from '../../api/enhetsregisteretApi';
import Underenhet from './Underenhet';
import OverordnetEnhet from './OverordnetEnhet';
import './OmVirksomheten.css';
import { Panel } from '@navikt/ds-react';
import { Brodsmulesti } from '../Banner';

const Kontaktpanel = ({ children }: { children: React.ReactNode }) => (
    <Panel className="informasjon-om-bedrift">{children}</Panel>
);

const OmVirksomheten: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const vnr = valgtOrganisasjon?.organisasjon.OrganizationNumber;
    const orgnr = valgtOrganisasjon?.organisasjon.ParentOrganizationNumber;

    const overordnetenhet = useOverordnetEnhet(orgnr);
    const { underenhet } = useUnderenhet(vnr);

    return (
        <>
            <Brodsmulesti
                brodsmuler={[
                    { url: '/bedriftsinformasjon', title: 'Om virksomheten', handleInApp: true },
                ]}
            />
            {overordnetenhet !== undefined && underenhet !== undefined ? (
                <>
                    <Kontaktpanel>
                        <Underenhet underenhet={underenhet} />
                    </Kontaktpanel>
                    <Kontaktpanel>
                        <OverordnetEnhet overordnetenhet={overordnetenhet} />
                    </Kontaktpanel>
                </>
            ) : (
                <Kontaktpanel>
                    <div>Kunne ikke hente informasjon</div>
                </Kontaktpanel>
            )}
        </>
    );
};

export default OmVirksomheten;
