import { z } from 'zod';
import useSWR from 'swr';
import { useContext, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import * as Sentry from '@sentry/browser';

export const useAntallArbeidsforholdFraAareg = (): number => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? {
                  url: '/min-side-arbeidsgiver/arbeidsgiver-arbeidsforhold-api/antall-arbeidsforhold',
                  jurenhet: valgtOrganisasjon.organisasjon.ParentOrganizationNumber ?? '',
                  orgnr: valgtOrganisasjon.organisasjon.OrganizationNumber,
              }
            : null,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                setRetries((x) => x + 1);
                if (retries === 5) {
                    Sentry.captureMessage(
                        `hent antall arbeidsforhold fra aareg feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
            },
            errorRetryInterval: 300,
            fallbackData: 0,
        }
    );

    return data;
};

const Oversikt = z.object({
    second: z.number().nullable(),
});

const fetcher = async ({
    url,
    jurenhet,
    orgnr,
}: {
    url: string;
    jurenhet: string;
    orgnr: string;
}) => {
    const respons = await fetch(url, {
        headers: {
            jurenhet,
            orgnr,
        },
    });
    if (respons.status !== 200) throw respons;

    return Oversikt.parse(await respons.json()).second ?? 0;
};
