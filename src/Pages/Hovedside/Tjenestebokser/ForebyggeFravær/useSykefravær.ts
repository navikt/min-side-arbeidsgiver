import { z } from 'zod';
import useSWR from 'swr';
import { useState } from 'react';
import { erDriftsforstyrrelse, erUnauthorized } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

const Sykefraværsrespons = z.object({
    type: z.string(),
    label: z.string(),
    prosent: z.number(),
});

export type Sykefraværsrespons = z.infer<typeof Sykefraværsrespons>;

export const useSykefravær = (): Sykefraværsrespons | undefined => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        `${__BASE_PATH__}/api/sykefravaerstatistikk/${valgtOrganisasjon.organisasjon.orgnr}`,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (
                    retries === 5 &&
                    !erDriftsforstyrrelse(error.status) &&
                    !erUnauthorized(error.status)
                ) {
                    console.error(
                        `#MSA: hent sykefraværsstatistikk fra min-side-arbeidsgiver-api feilet med ${
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
