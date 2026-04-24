import { z } from 'zod';
import useSWR from 'swr';
import { useState } from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import { Lenke } from '../../GeneriskeElementer/Lenke';
import { erStøy } from '../../utils/util';
import './ManglerKontonummerAlert.css';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import { gittMiljo } from '../../utils/environment';

export const ManglerKontonummerAlert = () => {
    const kontonummerStatus = manglerKontonummerAlert();
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const kanEndreKontonummer =
        valgtOrganisasjon.altinntilgang.endreBankkontonummerForRefusjoner ?? false;

    if (kontonummerStatus.status !== 'MANGLER_KONTONUMMER') {
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
                        <Lenke
                            href={gittMiljo({
                                prod: `https://arbeidsgiver.nav.no/endre-kontonummer/`,
                                other: `https://sokos-kro-selvbetjening-frontend.ekstern.dev.nav.no/endre-kontonummer/`,
                            })}
                        >
                            Legg inn kontonummer for refusjon fra Nav.
                        </Lenke>
                    </>
                ) : (
                    <>
                        {' '}
                        Les mer om
                        <Lenke
                            href={`https://www.nav.no/arbeidsgiver/endre-kontonummer`}
                        >
                            kontonummer for refusjon.
                        </Lenke>
                    </>
                )}
            </Alert>
        </div>
    );
};

const KontonummerStatusRespons = z.object({
    status: z.enum(['OK', 'MANGLER_KONTONUMMER']),
});
type KontonummerStatus = z.infer<typeof KontonummerStatusRespons>;

const fallbackData: KontonummerStatus = {
    status: 'OK',
};

const manglerKontonummerAlert = (): KontonummerStatus => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(
        {
            url: `${__BASE_PATH__}/api/kontonummerStatus/v1`,
            virksomhetsnummer: valgtOrganisasjon.organisasjon.orgnr,
        },
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5 && !erStøy(error)) {
                    console.error(
                        `#FARO: hent kontonummerStatus fra min-side-arbeidsgiver feilet med ${
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

    return KontonummerStatusRespons.parse(await respons.json());
};
