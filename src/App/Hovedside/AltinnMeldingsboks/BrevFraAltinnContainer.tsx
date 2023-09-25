import React, { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { Alert, Heading, BodyLong } from '@navikt/ds-react';
import { useLocalStorage } from '../../hooks/useStorage';

const BrevFraAltinnContainer: React.FunctionComponent = (_) => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [kryssetUt, settKryssetUt] = useLocalStorage('tilskuddsbrev-borte-krysset-ut', false);

    if (
        valgtOrganisasjon !== undefined &&
        valgtOrganisasjon.altinntilgang.tilskuddsbrev &&
        !kryssetUt
    ) {
        return (
            <Alert variant="info" closeButton onClose={() => settKryssetUt(true)}>
                <Heading spacing size="small" level="3">
                    Hvor er tilskuddsbrevene?
                </Heading>
                For å finne tilskuddsbrev om NAV-tiltak må du gå til Altinn innboks på aktuell
                virksomhet. Vi har fjernet lenken fra Min side – arbeidsgiver.
            </Alert>
        );
    } else {
        return null;
    }
};

export default BrevFraAltinnContainer;
