import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { useOverordnetEnhet, useUnderenhet } from '../../api/enhetsregisteretApi';
import Underenhet from './Underenhet';
import OverordnetEnhet from './OverordnetEnhet';
import './OmVirksomheten.css';
import { Box } from '@navikt/ds-react';

const Kontaktpanel = ({ children }: { children: React.ReactNode }) => (
    <Box className="informasjon-om-bedrift">{children}</Box>
);

const OmVirksomheten: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const vnr = valgtOrganisasjon?.organisasjon.OrganizationNumber;
    const orgnr = valgtOrganisasjon?.organisasjon.ParentOrganizationNumber;

    const overordnetenhet = useOverordnetEnhet(orgnr);
    const { underenhet } = useUnderenhet(vnr);

    return (
        <>
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
