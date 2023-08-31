import { z } from 'zod';
import useSWR from 'swr';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/react';

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

    return data?.second ?? 0;
};

const Oversikt = z.object({
    second: z.number().optional(),
});

type AntallArbeidsforholdType = z.infer<typeof Oversikt>;

const fetcher = async ({
    url,
    jurenhet,
    orgnr,
}: {
    url: string;
    jurenhet: string;
    orgnr: string;
}) => {
    const standardRespons: AntallArbeidsforholdType = { second: -1 };
    try {
        const respons = await fetch(url, {
            headers: {
                jurenhet,
                orgnr,
            },
        });
        if (!respons.ok) {
            Sentry.captureMessage(
                `hent antall arbeidsforhold fra aareg feilet med ${respons.status}`,
                Severity.Warning
            );
            return standardRespons;
        }

        const oversikt = Oversikt.parse(await respons.json());
        return oversikt.second === 0 ? standardRespons : oversikt;
    } catch (error) {
        Sentry.captureException(error);
        return standardRespons;
    }
};
