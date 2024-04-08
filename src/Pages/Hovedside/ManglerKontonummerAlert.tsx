import { z } from 'zod';
import useSWR from 'swr';
import { useContext, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { Alert, Heading } from '@navikt/ds-react';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { erDriftsforstyrrelse } from '../../utils/util';
import './ManglerKontonummerAlert.css';

export const ManglerKontonummerAlert = () => {
    const varslingStatus = manglerKontonummerAlert();
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const kanEndreKontonummer =
        valgtOrganisasjon?.altinntilgang.endreBankkontonummerForRefusjoner ?? false;

    if (varslingStatus.status !== 'MANGLER_KONTONUMMER') {
        return null;
    }

    return (
        <div role="status">
            <Alert variant="warning" role="status" className="kontonummer_alert">
                <Heading spacing size="small" level="2">
                    Virksomheten må legge inn kontonummer
                </Heading>
                For at NAV skal kunne utbetale refusjoner trenger vi et kontonummer. Kontonummret
                benyttes av NAV ved refusjoner av sykepenger, foreldrepenger, stønader ved barns
                sykdom, pleie-, opplærings- og omsorgspenger, tilskudd til sommerjobb og
                lønnstilskudd.
                {kanEndreKontonummer ? (
                    <>
                        {' '}
                        Gå til altinn og
                        <LenkeMedLogging
                            href="https://info.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/bankkontonummer-for-refusjoner-fra-nav-til-arbeidsgiver/"
                            loggLenketekst="Endre kontonummer"
                        >
                            legg inn kontonummer for refusjon fra NAV.
                        </LenkeMedLogging>
                    </>
                ) : (
                    <>
                        {' '}
                        Les mer om
                        <LenkeMedLogging
                            href={`https://www.nav.no/arbeidsgiver/endre-kontonummer`}
                            loggLenketekst="kontonummer for refusjon."
                        >
                            kontonummer for refusjon.
                        </LenkeMedLogging>
                    </>
                )}
            </Alert>
        </div>
    );
};

const VarslingStatusRespons = z.object({
    status: z.enum(['OK', 'MANGLER_KONTONUMMER']),
});
type VarslingStatus = z.infer<typeof VarslingStatusRespons>;

const fallbackData: VarslingStatus = {
    status: 'OK',
};

const manglerKontonummerAlert = (): VarslingStatus => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        valgtOrganisasjon !== undefined
            ? {
                  url: `${__BASE_PATH__}/api/kontonummerStatus/v1`,
                  virksomhetsnummer: valgtOrganisasjon.organisasjon.OrganizationNumber,
              }
            : null,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5 && !erDriftsforstyrrelse(error.status)) {
                    console.error(
                        `#MSA: hent kontonummerStatus fra min-side-arbeidsgiver feilet med ${
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
