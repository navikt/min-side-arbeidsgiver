import { Alert, BodyShort, Heading, HelpText, Label } from '@navikt/ds-react';
import React from 'react';
import Tekstboks from './Tekstboks';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import Underenhet from './Underenhet';
import { Hovedenhet } from '../../api/enhetsregisteretApi';

export const KontonummerUnderenhet = ({ underenhet }: { underenhet: Underenhet }) => {
    const { kontonummer, orgnummer } = { kontonummer: undefined, orgnummer: undefined }; //TODO Hente kontonummer og tilhørende orgnummer

    if (kontonummer === undefined) return null;

    return (
        <Tekstboks>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Heading size="small" level="3">
                    Kontonummer for underenhet
                </Heading>
                <HelpText>
                    Kontonumret benyttes av NAV ved refusjoner av sykepenger, foreldrepenger,
                    stønader ved barns sykdom, pleie-, opplærings- og omsorgspenger, tilskudd til
                    sommerjobb og lønnstilskudd.
                </HelpText>
            </div>
            {orgnummer !== underenhet.organisasjonsnummer && (
                <BodyShort> Hentet fra overordnet enhet</BodyShort>
            )}
            <Kontonummer kontonummer={kontonummer} />
            <LenkeMedLogging
                loggLenketekst={'Endre kontonummer i Altinn'}
                href={
                    'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/bankkontonummer-for-refusjoner-fra-nav-til-arbeidsgiver/'
                }
            >
                Endre kontonummer i Altinn
            </LenkeMedLogging>
        </Tekstboks>
    );
};

export const KontonummerOverordnetEnhet = ({
    overordnetEnhet,
}: {
    overordnetEnhet: Hovedenhet;
}) => {
    const enhetstype =
        overordnetEnhet.organisasjonsform?.kode === 'ORGL' ? 'Organisasjonsledd' : 'Hovedenhet';

    const { kontonummer, orgnummer } = { kontonummer: undefined, orgnummer: undefined }; //TODO Hente kontonummer og tilhørende orgnummer

    return (
        <Tekstboks>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Heading size="small" level="3">
                    Kontonummer for {enhetstype.toLowerCase()}
                </Heading>
                <HelpText>
                    Kontonumret benyttes av NAV ved refusjoner av sykepenger, foreldrepenger,
                    stønader ved barns sykdom, pleie-, opplærings- og omsorgspenger, tilskudd til
                    sommerjobb og lønnstilskudd.
                </HelpText>
            </div>

            {kontonummer === undefined ? (
                <Alert variant="warning">
                    <Heading spacing size="small" level="3">
                        Kontonummer mangler
                    </Heading>
                    For at NAV skal kunne utbetale refusjoner trenger vi et kontonummer.
                </Alert>
            ) : (
                <>
                    {orgnummer !== overordnetEnhet.organisasjonsnummer && (
                        <BodyShort> Hentet fra overordnet enhet</BodyShort>
                    )}
                    <Kontonummer kontonummer={kontonummer} />
                </>
            )}
            <LenkeMedLogging
                loggLenketekst={'Endre kontonummer i Altinn'}
                href={
                    'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/bankkontonummer-for-refusjoner-fra-nav-til-arbeidsgiver/'
                }
            >
                Endre kontonummer i Altinn
            </LenkeMedLogging>
        </Tekstboks>
    );
};

const Kontonummer = ({ kontonummer }: { kontonummer: string }) => (
    <>
        <BodyShort style={{ fontSize: '32px', margin: '8px 0' }}>
            {' '}
            {`${kontonummer.substring(0, 4)}`}
            {'.'}
            {`${kontonummer.substring(4, 6)}`}
            {'.'}
            {`${kontonummer.substring(6)}`}
        </BodyShort>
    </>
);
