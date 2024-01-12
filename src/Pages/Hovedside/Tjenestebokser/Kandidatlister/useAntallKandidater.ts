import { z } from 'zod';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';

export const useAntallKandidater = (): number => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? `${__BASE_PATH__}/presenterte-kandidater-api/ekstern/antallkandidater?virksomhetsnummer=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
            : null,
        fetcher,
        {
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if ((error.status === 502 || error.status === 503) && retryCount <= 5) {
                    setTimeout(() => revalidate({ retryCount }), 1000);
                } else {
                    Sentry.captureMessage(
                        `hent antall kandidater fra presenterte-kandidater-api feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
            },
            fallbackData: 0,
        }
    );

    return data ?? 0;
};

const PresenterteKandidater = z.object({
    antallKandidater: z.number(),
});

const fetcher = async (url: string) => {
    const respons = await fetch(url);

    if (respons.status === 401) return;
    if (respons.status !== 200) throw respons;
    return PresenterteKandidater.parse(await respons.json()).antallKandidater;
};
