import { z } from 'zod';
import useSWR from 'swr';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import * as Sentry from '@sentry/browser';

export const useAntallArbeidsforholdFraAareg = (): number => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? {
                  url: '/min-side-arbeidsgiver/antall-arbeidsforhold',
                  jurenhet: valgtOrganisasjon.organisasjon.ParentOrganizationNumber ?? '',
                  orgnr: valgtOrganisasjon.organisasjon.OrganizationNumber,
              }
            : null,
        fetcher
    );

    return data ?? 0;
};

const Oversikt = z.object({
    second: z.number().optional(),
});

const fetcher = async ({
    url,
    jurenhet,
    orgnr,
}: {
    url: string;
    jurenhet: string;
    orgnr: string;
}) => {
    try {
        const respons = await fetch(url, {
            headers: {
                jurenhet,
                orgnr,
            },
        });
        if (respons.status === 200) return Oversikt.parse(await respons.json()).second;
        if (respons.status === 401) return 0;

        Sentry.captureMessage(
            `hent antall arbeidsforhold fra aareg feilet med ${respons.status}, ${respons.statusText}`
        );
        return 0;
    } catch (error) {
        Sentry.captureException(error);
        return 0;
    }
};
