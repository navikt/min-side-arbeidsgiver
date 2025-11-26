import { z } from 'zod';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { erStøy } from '../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import { logAnalyticsEvent } from '../../utils/analytics';

export const ManglerKofuviAlert = () => {
    const varslingStatus = manglerKofuviAlert();

    useEffect(() => {
        logAnalyticsEvent('komponent-lastet', {
            komponent: 'ManglerKofuviAlert',
            status: varslingStatus.status,
        });
    }, [varslingStatus]);

    if (varslingStatus.status !== 'MANGLER_KOFUVI') {
        return null;
    }

    return (
        <div role="status">
            <Alert variant="error" role="status">
                <Heading spacing size="small" level="2">
                    Virksomheten må legge inn varslingsadresse
                </Heading>
                Virksomheten mangler varslingsadresse (en e-post eller et mobilnummer). Virksomheten
                din må legge inn dette slik at NAV kan kommunisere digitalt med dere. <br />
                <LenkeMedLogging
                    href="https://www.altinn.no/hjelp/profil/kontaktinformasjon-og-varslinger/"
                    loggLenketekst="Les om varslingsadresse i Altinn"
                >
                    Les om varslingsadresse i Altinn
                </LenkeMedLogging>
            </Alert>
        </div>
    );
};

const VarslingStatusRespons = z.object({
    status: z.enum(['OK', 'MANGLER_KOFUVI', 'ANNEN_FEIL']),
    varselTimestamp: z.string(),
    kvittertEventTimestamp: z.string(),
});
type VarslingStatus = z.infer<typeof VarslingStatusRespons>;

const fallbackData: VarslingStatus = {
    status: 'OK',
    varselTimestamp: '',
    kvittertEventTimestamp: '',
};

const manglerKofuviAlert = (): VarslingStatus => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        {
            url: `${__BASE_PATH__}/api/varslingStatus/v1`,
            virksomhetsnummer: valgtOrganisasjon.organisasjon.orgnr,
        },
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5 && !erStøy(error)) {
                    console.error(
                        `#FARO: hent varslingStatus fra min-side-arbeidsgiver feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
                setRetries((x) => x + 1);
            },
            errorRetryInterval: 300,
            fallbackData,
        }
    );

    return data;
};

const fetcher = async ({ url, virksomhetsnummer }: { url: string; virksomhetsnummer: string }) => {
    const respons = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ virksomhetsnummer }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (respons.status !== 200) throw respons;

    return VarslingStatusRespons.parse(await respons.json());
};
