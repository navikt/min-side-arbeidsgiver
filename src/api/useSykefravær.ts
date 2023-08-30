import { z } from 'zod';
import useSWR, { SWRResponse } from 'swr';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../App/OrganisasjonDetaljerProvider';
import * as Sentry from '@sentry/browser';

const Sykefraværsrespons = z.object({
    type: z.string(),
    label: z.string(),
    prosent: z.number(),
});
export type Sykefraværsrespons = z.infer<typeof Sykefraværsrespons>;

export const useSykefravær = (): SWRResponse<Sykefraværsrespons, any> => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const orgnr = valgtOrganisasjon?.organisasjon.OrganizationNumber;

    const url = `/min-side-arbeidsgiver/api/sykefravaerstatistikk/${orgnr}`;

    const fetcher = async (url: string) => {
        const respons = await fetch(url);
        return Sykefraværsrespons.parse(await respons.json());
    };

    const respons = useSWR(valgtOrganisasjon !== undefined ? url : null, fetcher);
    const { error } = respons;

    if (error !== undefined) {
        Sentry.captureException(error);
    }

    return respons;
};
