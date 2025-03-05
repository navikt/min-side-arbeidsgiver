import { Alert, BodyShort, Heading, HelpText } from '@navikt/ds-react';
import React, { useState } from 'react';
import './Kontonummer.css';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { Hovedenhet, Underenhet as UnderenhetType } from '../../api/enhetsregisteretApi';
import useSWR from 'swr';
import { z } from 'zod';

import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerContext';
import { erDriftsforstyrrelse, erUnauthorized } from '../../utils/util';

const KontonummerRespons = z
    .object({
        status: z.string(),
        orgnr: z.string().nullable(),
        kontonummer: z.string().nullable(),
    })
    .refine(
        (data) => {
            if (data.status === 'OK') {
                return data.orgnr !== null && data.kontonummer !== null;
            }
            return data.orgnr === null && data.kontonummer === null;
        },
        {
            message:
                'orgnr og kontonummer er enten begge non-nullable (for status OK) eller er begge null (for status MANGLER_KONTONUMMER)',
            path: ['orgnr', 'kontonummer'],
        }
    );

const KontonummerInput = z.object({
    orgnrForTilgangstyring: z.string(),
    orgnrForOppslag: z.string(),
});

export type KontonummerInput = z.infer<typeof KontonummerInput>;

const kontonummerFetcher = async ({
    url,
    kontonummerRequest,
}: {
    url: string;
    kontonummerRequest: KontonummerInput;
}) => {
    const response = await fetch(url, {
        body: JSON.stringify(kontonummerRequest),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status != 200) {
        throw response;
    }
    return KontonummerRespons.parse(await response.json());
};

const useKontonummer = (input: KontonummerInput) => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();

    if (
        !organisasjonsInfo[input.orgnrForTilgangstyring].altinntilgang
            .endreBankkontonummerForRefusjoner
    ) {
        return null;
    }

    const [retries, setRetries] = useState(0);
    const { data: kontonummerInfo } = useSWR(
        { url: `${__BASE_PATH__}/api/kontonummer/v1`, kontonummerRequest: input },
        kontonummerFetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (
                    retries === 5 &&
                    !erDriftsforstyrrelse(error.status) &&
                    !erUnauthorized(error.status)
                ) {
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
    const kontonummerInfo = useKontonummer({
        orgnrForTilgangstyring: underenhet.overordnetEnhet, // kontonummer tilgangstyres på overordnet enhet
        orgnrForOppslag: underenhet.organisasjonsnummer,
    });

    if (!kontonummerInfo || kontonummerInfo.status !== 'OK') return null;

    return (
        <div className={'kontonummer'}>
            <KontonummerTittel enhetsType={'underenhet'} />
            <KontonummerVisning
                orgnr={kontonummerInfo.orgnr!}
                kontonummer={kontonummerInfo.kontonummer!}
                oppslåttOrganisasjonsnummer={underenhet.organisasjonsnummer}
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

    const kontonummerInfo = useKontonummer({
        orgnrForTilgangstyring: overordnetEnhet.organisasjonsnummer,
        orgnrForOppslag: overordnetEnhet.organisasjonsnummer,
    });

    if (!kontonummerInfo) return null;

    return (
        <div className={'kontonummer'}>
            <KontonummerTittel enhetsType={enhetstype} />
            {kontonummerInfo.status !== 'OK' ? (
                <Alert variant="warning">
                    <Heading spacing size="small" level="3">
                        Kontonummer mangler
                    </Heading>
                    For at NAV skal kunne utbetale refusjoner trenger vi et kontonummer.
                </Alert>
            ) : (
                <KontonummerVisning
                    orgnr={kontonummerInfo.orgnr!}
                    kontonummer={kontonummerInfo.kontonummer!}
                    oppslåttOrganisasjonsnummer={overordnetEnhet.organisasjonsnummer}
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
    oppslåttOrganisasjonsnummer,
    orgnr,
    kontonummer,
}: {
    oppslåttOrganisasjonsnummer: string;
    orgnr: string;
    kontonummer: string;
}) => (
    <>
        {orgnr !== oppslåttOrganisasjonsnummer && (
            <BodyShort size={'small'}> Hentet fra overordnet enhet</BodyShort>
        )}
        <BodyShort style={{ fontSize: '18px' }}>
            {' '}
            {`${kontonummer.substring(0, 4)}`}
            {'.'}
            {`${kontonummer.substring(4, 6)}`}
            {'.'}
            {`${kontonummer.substring(6)}`}
        </BodyShort>
    </>
);
