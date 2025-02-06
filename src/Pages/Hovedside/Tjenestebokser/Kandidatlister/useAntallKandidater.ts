import { z } from 'zod';
import { useState } from 'react';
import useSWR from 'swr';
import { erDriftsforstyrrelse } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

export const useAntallKandidater = (): number => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const [retries, setRetries] = useState(0);

    const { data } = useSWR(
        `${__BASE_PATH__}/presenterte-kandidater-api/ekstern/antallkandidater?virksomhetsnummer=${valgtOrganisasjon.organisasjon.orgnr}`,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5 && !erDriftsforstyrrelse(error.status)) {
                    console.error(
                        `#MSA: hent antall kandidater fra presenterte-kandidater-api feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
                setRetries((x) => x + 1);
            },
        }
    );

    return data ?? 0;
};

const PresenterteKandidater = z.object({
    antallKandidater: z.number(),
});

const fetcher = async (url: string) => {
    const respons = await fetch(url);

    if (respons.status === 401) return undefined;
    if (respons.status !== 200) throw respons;
    return PresenterteKandidater.parse(await respons.json()).antallKandidater;
};
