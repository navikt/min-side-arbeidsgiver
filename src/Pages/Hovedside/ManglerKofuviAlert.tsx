import { z } from 'zod';
import useSWR from 'swr';
import { useContext, useEffect, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { Alert, Heading } from '@navikt/ds-react';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { erDriftsforstyrrelse } from '../../utils/util';
import amplitude from '../../utils/amplitude';

export const ManglerKofuviAlert = () => {
    const varslingStatus = manglerKofuviAlert();

    useEffect(() => {
        amplitude.logEvent('komponent-lastet', {
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
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? {
                  url: `${__BASE_PATH__}/api/varslingStatus/v1`,
                  virksomhetsnummer: valgtOrganisasjon.organisasjon.OrganizationNumber,
              }
            : null,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5 && !erDriftsforstyrrelse(error.status)) {
                    console.error(
                        `#MSA: hent varslingStatus fra min-side-arbeidsgiver feilet med ${
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
