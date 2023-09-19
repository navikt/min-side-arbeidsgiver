import React, { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { Alert, Heading, BodyLong } from '@navikt/ds-react';

const BrevFraAltinnContainer: React.FunctionComponent = (_) => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon !== undefined && valgtOrganisasjon.altinntilgang.tilskuddsbrev) {
        return (
            <Alert variant="info">
                <Heading size="medium" level="3">
                    Tilskuddsbrev om NAV-tiltak fra Altinn innboks
                </Heading>
                <BodyLong>Tilskuddsbrev om NAV-tiltak ligger i Altinn innboks.</BodyLong>
            </Alert>
        );
    } else {
        return null;
    }
};

export default BrevFraAltinnContainer;
