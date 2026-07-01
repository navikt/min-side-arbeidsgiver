import { z } from 'zod';
import useSWR from 'swr';
import { useState } from 'react';
import { erStøy } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

// Midlertidig endepunkt hos team-esyfo. Kun meta.total brukes.
// Byttes ut når team-esyfo leverer et mer spesifikt endepunkt.
const Requirement = z
    .object({
        meta: z.object({ total: z.number() }),
    })
    .passthrough();

// createdAfter = i dag minus 1 år (fullt ISO-instant med Z). Midlertidig detalj –
// forsvinner med det nye endepunktet, derfor beregnet her og holdt utenfor SWR-nøkkelen.
const createdAfterEttÅrSiden = (): string => {
    const d = new Date();
    d.setUTCFullYear(d.getUTCFullYear() - 1);
    return d.toISOString();
};

const fetcher = async ({
    url,
    orgNumber,
}: {
    url: string;
    orgNumber: string;
}): Promise<number> => {
    const params = new URLSearchParams({
        orgNumber,
        createdAfter: createdAfterEttÅrSiden(),
    });
    const respons = await fetch(`${url}?${params}`);
    if (respons.status !== 200) throw respons;
    return Requirement.parse(await respons.json()).meta.total;
};

export const useAntallSykmeldteManglerLeder = (): number => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const orgNumber = valgtOrganisasjon.organisasjon.orgnr;
    const [retries, setRetries] = useState(0);

    const { data } = useSWR(
        {
            url: `${__BASE_PATH__}/esyfo-narmesteleder/api/v1/linemanager/requirement`,
            orgNumber,
        },
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                setRetries((x) => x + 1);
                if (retries === 5 && !erStøy(error)) {
                    console.error(
                        `#FARO: hent antall sykmeldte mangler leder fra esyfo-narmesteleder feilet med ${
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
