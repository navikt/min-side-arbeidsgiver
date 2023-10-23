import { altinntjeneste, AltinntjenesteId } from './tjenester';
import { z } from 'zod';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { useMemo, useState } from 'react';

const altinnTilgangssøknadUrl = '/min-side-arbeidsgiver/api/altinn-tilgangssoknad';

const AltinnTilgangssøknad = z.object({
    orgnr: z.string(),
    serviceCode: z.string(),
    serviceEdition: z.number(),
    status: z.string(),
    createdDateTime: z.string(),
    lastChangedDateTime: z.string(),
    submitUrl: z.string(),
});

export type AltinnTilgangssøknad = z.infer<typeof AltinnTilgangssøknad>;

const AltinnTilgangssøknadResponse = z.array(AltinnTilgangssøknad);
type AltinnTilgangssøknadResponse = z.infer<typeof AltinnTilgangssøknadResponse>;

export const useAltinnTilgangssøknader = (): AltinnTilgangssøknadResponse => {
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(altinnTilgangssøknadUrl, fetcher, {
        onError: (error) => {
            if (retries === 5) {
                Sentry.captureMessage(
                    `hent AltinnTilgangssøknader fra min-side-arbeidsgiver-api feilet med ${
                        error.status !== undefined ? `${error.status} ${error.statusText}` : error
                    }`
                );
            }
            setRetries((x) => x + 1);
        },
        onSuccess: () => {
            setRetries(0);
        },
        fallbackData: [],
        errorRetryInterval: 300,
    });

    return useMemo(() => data, [JSON.stringify(data)]);
};

const fetcher = async (url: string) => {
    const respons = await fetch(url);

    if (respons.status !== 200) throw respons;

    return AltinnTilgangssøknadResponse.parse(await respons.json());
};

export interface AltinnTilgangssøknadskjema {
    orgnr: string;
    redirectUrl: string;
    altinnId: AltinntjenesteId;
}

export interface AltinnTilgangssøknadskjemaDTO {
    orgnr: string;
    redirectUrl: string;
    serviceCode: string;
    serviceEdition: number;
}

export const opprettAltinnTilgangssøknad = async (
    skjema: AltinnTilgangssøknadskjema
): Promise<AltinnTilgangssøknad | null> => {
    const dto: AltinnTilgangssøknadskjemaDTO = {
        orgnr: skjema.orgnr,
        redirectUrl: skjema.redirectUrl,
        serviceCode: altinntjeneste[skjema.altinnId].tjenestekode,
        serviceEdition: parseInt(altinntjeneste[skjema.altinnId].tjenesteversjon),
    };

    const response = await fetch(altinnTilgangssøknadUrl, {
        method: 'POST',
        body: JSON.stringify(dto),
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
        },
    });

    if (!response.ok) {
        return null;
    }

    return (await response.json()) as AltinnTilgangssøknad;
};
