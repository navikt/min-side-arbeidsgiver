import { z } from 'zod';
import useSWR, { SWRResponse } from 'swr';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../App/OrganisasjonDetaljerProvider';
import * as Sentry from '@sentry/browser';

const Oversikt = z.object({
    second: z.number().optional(),
});

export type AntallArbeidsforholdType = z.infer<typeof Oversikt>;

export const useAntallArbeidsforholdFraAareg = (): SWRResponse<AntallArbeidsforholdType, any> => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const arbeidsgiverURL = '/min-side-arbeidsgiver/antall-arbeidsforhold';
    const headers = {
        headers:
            valgtOrganisasjon !== undefined
                ? {
                      jurenhet: valgtOrganisasjon.organisasjon.ParentOrganizationNumber ?? '',
                      orgnr: valgtOrganisasjon.organisasjon.OrganizationNumber,
                  }
                : {},
    };

    const fetcher = async (url: string, headers: {}) => {
        const respons = await fetch(url, headers);
        return Oversikt.parse(await respons.json());
    };

    const respons = useSWR(
        valgtOrganisasjon !== undefined ? [arbeidsgiverURL, headers] : null,
        ([url, headers]) => fetcher(url, headers)
    );

    const { error } = respons;
    if (error !== undefined) {
        Sentry.captureException(error);
    }
    return respons;
};
