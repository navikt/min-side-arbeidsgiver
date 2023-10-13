import { z } from 'zod';
import React, { useContext, useState } from 'react';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { Alert, BodyShort, Heading, Label, HelpText } from '@navikt/ds-react';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import './Kontaktinfo.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';

const KontaktinfoDetaljer = z.object({
    eposter: z.array(z.string()),
    telefonnumre: z.array(z.string()),
});

const KontaktinfoRespons = z.object({
    hovedenhet: KontaktinfoDetaljer.nullable(),
    underenhet: KontaktinfoDetaljer.nullable(),
});

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

const useKontaktinfo = () => {
    const orgnr = useContext(OrganisasjonsDetaljerContext).valgtOrganisasjon?.organisasjon
        ?.OrganizationNumber;
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

type KontaktinfoDetaljer = z.infer<typeof KontaktinfoDetaljer>;
const KontaktinfoListe = ({ kontaktinfo }: { kontaktinfo: KontaktinfoDetaljer }) => (
    <>
        {kontaktinfo.eposter.length > 0 ? (
            <div>
                <Label>E-post</Label>
                <ul>
                    {kontaktinfo.eposter.map((epost) => (
                        <li key={epost}>
                            <BodyShort>{epost}</BodyShort>
                        </li>
                    ))}
                </ul>
            </div>
        ) : null}
        {kontaktinfo.telefonnumre.length > 0 ? (
            <div>
                <Label>SMS</Label>
                <ul>
                    {kontaktinfo.telefonnumre.map((telefonnummer) => (
                        <li key={telefonnummer}>
                            <BodyShort>{telefonnummer}</BodyShort>
                        </li>
                    ))}
                </ul>
            </div>
        ) : null}
    </>
);

export const KontaktinfoUnderenhet = () => {
    const kontaktinfo = useKontaktinfo()?.underenhet ?? null;
    if (kontaktinfo === null) return null;
    if (kontaktinfo.eposter.length === 0 && kontaktinfo.telefonnumre.length === 0) return null;
    return (
        <div className="kontaktinfo">
            <TittelMedHjelpetekst>Varslingsadresser for underenhet</TittelMedHjelpetekst>
            <KontaktinfoListe kontaktinfo={kontaktinfo} />
            <AltinnLenke />
        </div>
    );
};

export const KontaktinfoHovedenhet = () => {
    const kontaktinfo = useKontaktinfo()?.hovedenhet ?? null;
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
                <KontaktinfoListe kontaktinfo={kontaktinfo} />
            )}
            <AltinnLenke />
        </div>
    );
};
