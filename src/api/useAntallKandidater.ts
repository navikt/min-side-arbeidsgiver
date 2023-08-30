import { z } from 'zod';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../App/OrganisasjonDetaljerProvider';
import useSWR, { SWRResponse } from 'swr';
import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/react';

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
        if (!respons.ok) {
            Sentry.captureMessage(
                `hent antall kandidater fra presenterte-kandidater-api feilet med ${respons.status}`,
                Severity.Warning
            );
            return { antallKandidater: 0 };
        }
        try {
            return PresenterteKandidater.parse(await respons.json());
        } catch (error) {
            Sentry.captureException(error);
            return { antallKandidater: 0 };
        }
    };

    return useSWR(valgtOrganisasjon !== undefined ? url : null, fetcher);
};
