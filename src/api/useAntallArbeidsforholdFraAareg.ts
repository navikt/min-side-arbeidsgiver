import { z } from 'zod';
import useSWR, { SWRResponse } from 'swr';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../App/OrganisasjonDetaljerProvider';
import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/react';

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
        const standardRespons: AntallArbeidsforholdType = { second: -1 };
        const respons = await fetch(url, headers);
        if (!respons.ok) {
            Sentry.captureMessage(
                `hent antall arbeidsforhold fra aareg feilet med ${respons.status}`,
                Severity.Warning
            );
            return standardRespons;
        }
        try {
            const oversikt = Oversikt.parse(await respons.json());
            return oversikt.second === 0 ? standardRespons : oversikt;
        } catch (error) {
            Sentry.captureException(error);
            return standardRespons;
        }
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
