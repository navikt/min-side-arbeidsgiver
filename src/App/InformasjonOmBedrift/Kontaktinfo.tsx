import { z } from 'zod';
import React, { useState } from 'react';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { Alert, BodyShort, Heading, HelpText } from '@navikt/ds-react';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import './Kontaktinfo.css';

const KontaktinfoRespons = z.object({
    hovedenhet: z
        .object({
            eposter: z.array(z.string()),
            telefonnumre: z.array(z.string()),
        })
        .nullable(),
    underenhet: z
        .object({
            eposter: z.array(z.string()),
            telefonnumre: z.array(z.string()),
        })
        .nullable(),
});

export interface KontaktinfoType {
    eposter: string[];
    telefonnumre: string[];
}

const fetcher = async ({ url, orgnr }: { url: string; orgnr: string }) => {
    const body = { virksomhetsnummer: orgnr };
    const response = await fetch(url, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status !== 200) {
        throw response;
    }
    return KontaktinfoRespons.parse(await response.json());
};

export const useKontaktinfo = (orgnr?: string) => {
    const [retries, setRetries] = useState(0);

    const { data: kontaktinfo } = useSWR(
        orgnr === undefined ? null : { url: `/min-side-arbeidsgiver/api/kontaktinfo/v1/`, orgnr },
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5) {
                    Sentry.captureMessage(
                        `hent kontaktinfo fra min-side-arbeidsgiver-api feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
                setRetries((x) => x + 1);
            },
            errorRetryInterval: 300,
        }
    );
    return kontaktinfo;
};

const AltinnLenke = () => (
    <LenkeMedLogging
        loggLenketekst={'Oppdatere kofuvi Altinn ekstern lenke'}
        href="https://www.altinn.no/hjelp/profil/kontaktinformasjon-og-varslinger/"
    >
        Les om varslingsadresser på Altinn
    </LenkeMedLogging>
);

const TittelMedHjelpetekst = ({ children }: { children: React.ReactNode }) => (
    <div className="kontaktinfo-tittel">
        <Heading size="small">{children}</Heading>
        <HelpText title="Hva brukes det til?">
            Varslingsadressen brukes slik det offentlige kan kommunisere digitalt med virksomheten.
        </HelpText>
    </div>
);

interface KontaktinfoProps {
    kontaktinfo: KontaktinfoType | null;
}

export const KontaktinfoUnderenhet = ({ kontaktinfo }: KontaktinfoProps) => {
    if (kontaktinfo === null) return null;
    if (kontaktinfo.eposter.length === 0 && kontaktinfo.telefonnumre.length === 0) return null;
    return (
        <div className="kontaktinfo">
            <TittelMedHjelpetekst>Varslingsadresser for underenhet</TittelMedHjelpetekst>
            {kontaktinfo.eposter.length > 0 ? (
                <div>
                    <Heading size="xsmall">E-post</Heading>
                    {kontaktinfo.eposter.map((epost) => (
                        <BodyShort key={epost}>{epost}</BodyShort>
                    ))}
                </div>
            ) : null}
            {kontaktinfo.telefonnumre.length > 0 ? (
                <div>
                    <Heading size="xsmall">SMS</Heading>
                    {kontaktinfo.telefonnumre.map((telefonnummer) => (
                        <BodyShort key={telefonnummer}>{telefonnummer}</BodyShort>
                    ))}
                </div>
            ) : null}
            <AltinnLenke />
        </div>
    );
};

export const KontaktinfoHovedenhet = ({ kontaktinfo }: KontaktinfoProps) => {
    if (kontaktinfo === null) return null;
    return (
        <div className="kontaktinfo">
            <TittelMedHjelpetekst>Varslingsadresser for hovedenhet</TittelMedHjelpetekst>
            {kontaktinfo.eposter.length === 0 && kontaktinfo.telefonnumre.length === 0 ? (
                <Alert variant="warning">
                    Det mangler varslingsadresse. Varslingsadressen brukes slik det offentlige kan
                    kommunisere digitalt med virksomheten. Dere er må å ha minst en e-post eller
                    mobilnummer for varsling.
                </Alert>
            ) : (
                <>
                    {kontaktinfo.eposter.length > 0 ? (
                        <div>
                            <Heading size="xsmall">E-post</Heading>
                            {kontaktinfo.eposter.map((epost) => (
                                <BodyShort key={epost}>{epost}</BodyShort>
                            ))}
                        </div>
                    ) : null}
                    {kontaktinfo.telefonnumre.length > 0 ? (
                        <div>
                            <Heading size="xsmall">SMS</Heading>
                            {kontaktinfo.telefonnumre.map((telefonnummer) => (
                                <BodyShort key={telefonnummer}>{telefonnummer}</BodyShort>
                            ))}
                        </div>
                    ) : null}
                </>
            )}
            <AltinnLenke />
        </div>
    );
};
