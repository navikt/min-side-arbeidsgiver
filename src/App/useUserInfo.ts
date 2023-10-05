import { z } from 'zod';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { Organisasjon } from '../altinn/organisasjon';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import * as Record from '../utils/Record';
import { Set } from 'immutable';
import { useState } from 'react';

const UserInfoRespons = z.object({
    loaded: z.boolean(),
    altinnError: z.boolean(),
    organisasjoner: z.array(Organisasjon),
    tilganger: z
        .array(
            z.object({
                id: z.custom<AltinntjenesteId>(),
                tjenestekode: z.string(),
                tjenesteversjon: z.string(),
                organisasjoner: z.array(z.string()),
            })
        )
        .transform((tilganger) =>
            Record.fromEntries(tilganger.map((it) => [it.id, Set(it.organisasjoner)]))
        ),
});
type UserInfo = z.infer<typeof UserInfoRespons>;
export const useUserInfo = (): UserInfo => {
    const [exhausted, setExhausted] = useState(false);
    const { data, error } = useSWR('/min-side-arbeidsgiver/api/userInfo/v1', fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            if ((error.status === 502 || error.status === 503) && retryCount <= 5) {
                setTimeout(() => revalidate({ retryCount }), 500);
            } else {
                Sentry.captureMessage(
                    `hent userInfo fra min-side-arbeidsgiver feilet med ${
                        error.status !== undefined ? `${error.status} ${error.statusText}` : error
                    }`
                );
                setExhausted(true);
            }
        },
    });
    return {
        ...(data ?? {
            organisasjoner: [],
            tilganger: Record.map(altinntjeneste, () => Set<string>()),
        }),
        altinnError: data?.altinnError ?? error !== undefined,
        loaded: data?.loaded ?? exhausted,
    };
};

const fetcher = async (url: string) => {
    const respons = await fetch(url);

    if (respons.status === 401) return;
    if (respons.status !== 200) throw respons;

    return UserInfoRespons.parse(await respons.json());
};
