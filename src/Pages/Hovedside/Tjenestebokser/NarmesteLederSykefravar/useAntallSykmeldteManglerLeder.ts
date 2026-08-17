import { z } from 'zod';
import useSWR from 'swr';
import { useState } from 'react';
import { erStøy } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

const LinemanagerStatistics = z.object({
    employeesOnSickLeaveWithoutLinemanager: z.number(),
    employeesOnSickLeaveWithLinemanager: z.number(),
    employeesNotOnSickLeaveWithLinemanager: z.number(),
});

type LinemanagerStatistics = z.infer<typeof LinemanagerStatistics>;

const fetcher = async ({
    url,
    orgNumber,
}: {
    url: string;
    orgNumber: string;
}): Promise<LinemanagerStatistics> => {
    const params = new URLSearchParams({
        orgNumber,
    });
    const respons = await fetch(`${url}?${params}`);
    if (respons.status !== 200) throw respons;
    return LinemanagerStatistics.parse(await respons.json());
};

export const useAntallSykmeldteManglerLeder = (): {
    antallSykmeldteManglerLeder: number;
    visTjenesteboks: boolean;
} => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const orgNumber = valgtOrganisasjon.organisasjon.orgnr;
    const [retries, setRetries] = useState(0);

    const { data } = useSWR(
        {
            url: `${__BASE_PATH__}/esyfo-narmesteleder/internal/api/v1/linemanager/statistics`,
            orgNumber,
        },
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                setRetries((x) => x + 1);
                if (retries === 5 && !erStøy(error)) {
                    console.error(
                        `#FARO: hent linemanager-statistikk fra esyfo-narmesteleder feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
            },
            errorRetryInterval: 300,
            fallbackData: {
                employeesOnSickLeaveWithoutLinemanager: 0,
                employeesOnSickLeaveWithLinemanager: 0,
                employeesNotOnSickLeaveWithLinemanager: 0,
            },
        }
    );

    return {
        antallSykmeldteManglerLeder: data.employeesOnSickLeaveWithoutLinemanager,
        visTjenesteboks: Object.values(data).some((antall) => antall !== 0),
    };
};
