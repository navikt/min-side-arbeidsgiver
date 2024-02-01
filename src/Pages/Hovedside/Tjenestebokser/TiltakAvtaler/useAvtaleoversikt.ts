import { useContext, useMemo, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import useSWR from 'swr';
import { z } from 'zod';
import * as Sentry from '@sentry/browser';
import { count, erDriftsforstyrrelse } from '../../../../utils/util';

export type Avtaleoversikt = {
    ARBEIDSTRENING: number;
    MIDLERTIDIG_LONNSTILSKUDD: number;
    VARIG_LONNSTILSKUDD: number;
    SOMMERJOBB: number;
    INKLUDERINGSTILSKUDD: number;
    MENTOR: number;
};

export type Avtalenavn = keyof Avtaleoversikt;

export const useAvtaleoversikt = (): Avtaleoversikt => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [retries, setRetries] = useState(0);
    const { data: avtaler } = useSWR(
        valgtOrganisasjon !== undefined
            ? `${__BASE_PATH__}/tiltaksgjennomforing-api/avtaler/min-side-arbeidsgiver?bedriftNr=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
            : null,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5 && !erDriftsforstyrrelse(error.status)) {
                    Sentry.captureMessage(
                        `hent arbeidsavtaler fra tiltaksgjennomforing-api feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                } else {
                    setRetries((x) => x + 1);
                }
            },
            errorRetryInterval: 300,
            fallbackData: [],
        }
    );

    return useMemo(
        () => ({
            ARBEIDSTRENING: antallAvtaler(avtaler, 'ARBEIDSTRENING'),
            MIDLERTIDIG_LONNSTILSKUDD: antallAvtaler(avtaler, 'MIDLERTIDIG_LONNSTILSKUDD'),
            VARIG_LONNSTILSKUDD: antallAvtaler(avtaler, 'VARIG_LONNSTILSKUDD'),
            SOMMERJOBB: antallAvtaler(avtaler, 'SOMMERJOBB'),
            INKLUDERINGSTILSKUDD: antallAvtaler(avtaler, 'INKLUDERINGSTILSKUDD'),
            MENTOR: antallAvtaler(avtaler, 'MENTOR'),
        }),
        [avtaler]
    );
};

const antallAvtaler = (avtaler: Arbeidsavtale[], tiltaktype: Avtalenavn) =>
    count(avtaler, (it) => it.tiltakstype === tiltaktype);

interface Arbeidsavtale {
    tiltakstype: string;
}

const ArbeidsavtaleResponsType = z.array(
    z.object({
        tiltakstype: z.string(),
    })
);

const fetcher = async (url: string) => {
    const respons = await fetch(url);
    if (respons.status !== 200) throw respons;

    return ArbeidsavtaleResponsType.parse(await respons.json());
};
