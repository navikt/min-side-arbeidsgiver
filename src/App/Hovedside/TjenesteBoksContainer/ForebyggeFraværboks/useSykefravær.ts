import { z } from 'zod';
import useSWR from 'swr';
import { useContext, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import * as Sentry from '@sentry/browser';

const Sykefraværsrespons = z.object({
    type: z.string(),
    label: z.string(),
    prosent: z.number(),
});

export type Sykefraværsrespons = z.infer<typeof Sykefraværsrespons>;

export const useSykefravær = (): Sykefraværsrespons | undefined => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? `/min-side-arbeidsgiver/api/sykefravaerstatistikk/${valgtOrganisasjon.organisasjon.OrganizationNumber}`
            : null,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5) {
                    Sentry.captureMessage(
                        `hent sykefraværsstatistikk fra min-side-arbeidsgiver-api feilet med ${
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

    return data;
};

const fetcher = async (url: string) => {
    const respons = await fetch(url);

    if (respons.status === 204) return undefined;
    if (respons.status !== 200) throw respons;

    return Sykefraværsrespons.parse(await respons.json());
};
