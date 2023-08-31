import { z } from 'zod';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/react';

export const useAntallKandidater = (): number => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? `/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater?virksomhetsnummer=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
            : null,
        fetcher
    );

    return data?.antallKandidater ?? 0;
};

const PresenterteKandidater = z.object({
    antallKandidater: z.number(),
});

const fetcher = async (url: string) => {
    try {
        const respons = await fetch(url);
        if (!respons.ok) {
            Sentry.captureMessage(
                `hent antall kandidater fra presenterte-kandidater-api feilet med ${respons.status}`,
                Severity.Warning
            );
            return { antallKandidater: 0 };
        }
        return PresenterteKandidater.parse(await respons.json());
    } catch (error) {
        Sentry.captureException(error);
        return { antallKandidater: 0 };
    }
};
