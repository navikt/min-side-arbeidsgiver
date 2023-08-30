import { z } from 'zod';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../App/OrganisasjonDetaljerProvider';
import useSWR, { SWRResponse } from 'swr';
import * as Sentry from '@sentry/browser';

const PresenterteKandidater = z.object({
    antallKandidater: z.number(),
});

type PresenterteKandidater = z.infer<typeof PresenterteKandidater>;

export const useAntallKandidater = (): SWRResponse<PresenterteKandidater, any> => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const orgnr = valgtOrganisasjon?.organisasjon.OrganizationNumber;
    const url = `/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater?virksomhetsnummer=${orgnr}`;

    const fetcher = async (url: string) => {
        const respons = await fetch(url);
        return PresenterteKandidater.parse(await respons.json());
    };

    const respons = useSWR(valgtOrganisasjon !== undefined ? url : null, fetcher);
    const { error } = respons;

    if (error !== undefined) {
        Sentry.captureException(error);
    }

    return respons;
};
