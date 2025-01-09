import { Alert, BodyShort, Heading, HelpText } from '@navikt/ds-react';
import React, { useState } from 'react';
import './Kontonummer.css';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { Hovedenhet, Underenhet as UnderenhetType } from '../../api/enhetsregisteretApi';
import useSWR from 'swr';
import { z } from 'zod';

const KontonummerInfo = z.object({
    status: z.string(),
    orgnr: z.string().nullable(),
    kontonummer: z.string().nullable(),
});

type KontonummerInfo = z.infer<typeof KontonummerInfo>;

const kontonummerFetcher = async ({ url, orgnr }: { url: string; orgnr: string }) => {
    const body = { virksomhetsnummer: orgnr };
    const response = await fetch(url, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status != 200) {
        throw response;
    }
    return KontonummerInfo.parse(await response.json());
};
const useKontonummer = (orgnr: String) => {
    const [retries, setRetries] = useState(0);

    const { data: kontonummerInfo } = useSWR(
        orgnr === undefined ? null : { url: `${__BASE_PATH__}/api/kontonummer/v1`, orgnr },
        kontonummerFetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5) {
                    console.error(
                        `#MSA: hent kontonummer fra min-side-arbeidsgiver-api feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }\``
                    );
                }
                setRetries((x) => x + 1);
            },
            errorRetryInterval: 300,
        }
    );

    return kontonummerInfo;
};

export const KontonummerUnderenhet = ({ underenhet }: { underenhet: UnderenhetType }) => {
    const kontonummerInfo = useKontonummer(underenhet.organisasjonsnummer);

    if (!kontonummerInfo || kontonummerInfo.kontonummer == null) return null;

    return (
        <div className={'kontonummer'}>
            <KontonummerTittel enhetsType={'underenhet'} />
            <KontonummerVisning
                kontonummerInfo={kontonummerInfo}
                organisasjonsnummer={underenhet.organisasjonsnummer}
            />
            <EndreKontonummer />
        </div>
    );
};

export const KontonummerOverordnetEnhet = ({
    overordnetEnhet,
}: {
    overordnetEnhet: Hovedenhet;
}) => {
    const enhetstype =
        overordnetEnhet.organisasjonsform?.kode === 'ORGL' ? 'organisasjonsledd' : 'hovedenhet';

    const kontonummerInfo = useKontonummer(overordnetEnhet.organisasjonsnummer);

    if (!kontonummerInfo) return null;

    return (
        <div className={'kontonummer'}>
            <KontonummerTittel enhetsType={enhetstype} />
            {kontonummerInfo.kontonummer === null ? (
                <Alert variant="warning">
                    <Heading spacing size="small" level="3">
                        Kontonummer mangler
                    </Heading>
                    For at NAV skal kunne utbetale refusjoner trenger vi et kontonummer.
                </Alert>
            ) : (
                <KontonummerVisning
                    kontonummerInfo={kontonummerInfo}
                    organisasjonsnummer={overordnetEnhet.organisasjonsnummer}
                />
            )}
            <EndreKontonummer />
        </div>
    );
};

const EndreKontonummer = () => (
    <LenkeMedLogging
        loggLenketekst={'Endre kontonummer i Altinn'}
        href="https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/bankkontonummer-for-refusjoner-fra-nav-til-arbeidsgiver/"
    >
        Endre kontonummer i Altinn
    </LenkeMedLogging>
);

const KontonummerTittel = ({ enhetsType }: { enhetsType: string }) => (
    <div className={'kontonummer-tittel'}>
        <Heading size="small" level="3">
            Kontonummer for {enhetsType}
        </Heading>
        <HelpText>
            Kontonumret benyttes av NAV ved refusjoner av sykepenger, foreldrepenger, stønader ved
            barns sykdom, pleie-, opplærings- og omsorgspenger, tilskudd til sommerjobb og
            lønnstilskudd.
        </HelpText>
    </div>
);

const KontonummerVisning = ({
    organisasjonsnummer,
    kontonummerInfo,
}: {
    organisasjonsnummer: string;
    kontonummerInfo: KontonummerInfo;
}) => (
    <>
        {kontonummerInfo.orgnr !== organisasjonsnummer && (
            <BodyShort size={'small'}> Hentet fra overordnet enhet</BodyShort>
        )}
        <BodyShort style={{ fontSize: '18px' }}>
            {' '}
            {`${kontonummerInfo.kontonummer!.substring(0, 4)}`}
            {'.'}
            {`${kontonummerInfo.kontonummer!.substring(4, 6)}`}
            {'.'}
            {`${kontonummerInfo.kontonummer!.substring(6)}`}
        </BodyShort>
    </>
);
