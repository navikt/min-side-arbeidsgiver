import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';

// Kan fjernes 01.05.25
const EndreKontonummerInfo = () => {
    const now = new Date();
    const ikkeVisDato = new Date('2025-05-01');

    if (now > ikkeVisDato) return;

    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const kanEndreKontonummer =
        valgtOrganisasjon.altinntilgang.endreBankkontonummerForRefusjoner ?? false;

    if (!kanEndreKontonummer) return;

    return (
        <Alert variant="info" contentMaxWidth={false}>
            <Heading spacing size="small" level="3">
                Endringer i tilgang til å endre kontonummer hos NAV
            </Heading>
            <BodyLong spacing>
                Fra 1. mai 2025 strammes reglene inn for hvem som kan endre kontonummer for
                refusjoner fra NAV.<br />For å gjøre slike endringer, må du ha tilgang til
                enkelttjenesten: "Endre bankkontonummer for refusjoner fra NAV til arbeidsgiver". Se
                <LenkeMedLogging
                    href="https://www.nav.no/arbeidsgiver/endring-kontonummer"
                    loggLenketekst="endring kontonummer"
                >
                    Nytt om tilgang til endring av kontonummer for refusjoner fra Nav.
                </LenkeMedLogging>
            </BodyLong>
        </Alert>
    );
};

export default EndreKontonummerInfo;
