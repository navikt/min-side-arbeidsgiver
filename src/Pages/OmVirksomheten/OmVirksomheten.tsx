import React, { FunctionComponent } from 'react';
import { useOverordnetEnhet, useUnderenhet } from '../../api/enhetsregisteretApi';
import Underenhet from './Underenhet';
import OverordnetEnhet from './OverordnetEnhet';
import './OmVirksomheten.css';
import { Box } from '@navikt/ds-react';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import EndreKontonummerInfo from '../Hovedside/EndreKontonummerInfo';

const Kontaktpanel = ({ children }: { children: React.ReactNode }) => (
    <Box className="informasjon-om-bedrift">{children}</Box>
);

const OmVirksomheten: FunctionComponent = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const vnr = valgtOrganisasjon.organisasjon.orgnr;
    const orgnr = valgtOrganisasjon.parent?.orgnr;

    const overordnetenhet = useOverordnetEnhet(orgnr);
    const { underenhet } = useUnderenhet(vnr);

    return (
        <>
            {overordnetenhet !== undefined && underenhet !== undefined ? (
                <>
                    <Box className="alert-container">
                        <EndreKontonummerInfo />
                    </Box>
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
