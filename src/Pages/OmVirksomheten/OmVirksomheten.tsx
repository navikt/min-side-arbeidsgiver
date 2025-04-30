import React, { FunctionComponent } from 'react';
import { useOverordnetEnhet, useUnderenhet } from '../../api/enhetsregisteretApi';
import Underenhet from './Underenhet';
import OverordnetEnhet from './OverordnetEnhet';
import './OmVirksomheten.css';
import { Alert, BodyLong, Box, Heading } from '@navikt/ds-react';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { useCloseInfoboks } from '../../hooks/useCloseInfoboks';

const Kontaktpanel = ({ children }: { children: React.ReactNode }) => (
    <Box className="informasjon-om-bedrift">{children}</Box>
);

const InfoBoks = () => {
    const { closed, setClosed } = useCloseInfoboks('endre-kontonummer-info');

    if (closed) return;

    return (
        <Alert variant="info" contentMaxWidth={false} closeButton onClose={() => setClosed(true)}>
            <Heading spacing size="small" level="3">
                Endringer i tilgang til å endre kontonummer hos NAV
            </Heading>
            <BodyLong>
                Fra 1. mai 2025 strammes reglene inn for hvem som kan endre kontonummer for
                refusjoner fra NAV.
                <br />
                For å gjøre slike endringer, må du ha tilgang til enkelttjenesten: "Endre
                bankkontonummer for refusjoner fra NAV til arbeidsgiver". Se
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
                        <InfoBoks />
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
