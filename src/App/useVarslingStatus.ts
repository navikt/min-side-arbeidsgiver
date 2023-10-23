import { z } from 'zod';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { useContext, useState } from 'react';
import { OrganisasjonsDetaljerContext } from './OrganisasjonDetaljerProvider';

const VarslingStatusRespons = z.object({
    status: z.enum(['OK', 'MANGLER_KOFUVI', 'ANNEN_FEIL']),
    varselTimestamp: z.string(),
    kvittertEventTimestamp: z.string(),
});
type VarslingStatus = z.infer<typeof VarslingStatusRespons>;

const fallbackData: VarslingStatus = {
    status: 'OK',
    varselTimestamp: '',
    kvittertEventTimestamp: '',
};
export const useVarslingStatus = (): VarslingStatus => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? {
                  url: '/min-side-arbeidsgiver/api/varslingStatus/v1',
                  virksomhetsnummer: valgtOrganisasjon.organisasjon.OrganizationNumber,
              }
            : null,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5) {
                    Sentry.captureMessage(
                        `hent varslingStatus fra min-side-arbeidsgiver feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
                setRetries((x) => x + 1);
            },
            errorRetryInterval: 300,
            fallbackData,
        }
    );

    return data;
};

const fetcher = async ({ url, virksomhetsnummer }: { url: string; virksomhetsnummer: string }) => {
    const respons = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ virksomhetsnummer }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (respons.status !== 200) throw respons;

    return VarslingStatusRespons.parse(await respons.json());
};
