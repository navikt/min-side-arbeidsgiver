import { z } from 'zod';
import useSWR from 'swr';
import { useContext } from 'react';
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

    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? `/min-side-arbeidsgiver/api/sykefravaerstatistikk/${valgtOrganisasjon.organisasjon.OrganizationNumber}`
            : null,
        fetcher
    );

    return data;
};

const fetcher = async (url: string) => {
    try {
        const respons = await fetch(url);
        return Sykefraværsrespons.parse(await respons.json());
    } catch (error) {
        Sentry.captureException(error);
        return undefined;
    }
};
