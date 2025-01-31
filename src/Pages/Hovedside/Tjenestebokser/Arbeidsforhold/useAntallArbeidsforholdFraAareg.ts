import { z } from 'zod';
import useSWR from 'swr';
import { useState } from 'react';
import { erDriftsforstyrrelse } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

export const useAntallArbeidsforholdFraAareg = (): number => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        {
            url: `${__BASE_PATH__}/arbeidsgiver-arbeidsforhold-api/antall-arbeidsforhold`,
            jurenhet: valgtOrganisasjon.parent?.orgnr ?? '',
            orgnr: valgtOrganisasjon.organisasjon.orgnr,
        },
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                setRetries((x) => x + 1);
                if (retries === 5 && !erDriftsforstyrrelse(error.status)) {
                    console.error(
                        `#MSA: hent antall arbeidsforhold fra aareg feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
            },
            errorRetryInterval: 300,
            fallbackData: 0,
        }
    );

    return data;
};

const Oversikt = z.object({
    second: z.number().nullable(),
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
    const respons = await fetch(url, {
        headers: {
            jurenhet,
            orgnr,
        },
    });
    if (respons.status !== 200) throw respons;

    return Oversikt.parse(await respons.json()).second ?? 0;
};
