import { z } from 'zod';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { Organisasjon } from '../altinn/organisasjon';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import * as Record from '../utils/Record';
import { Set } from 'immutable';
import { useState } from 'react';

const UserInfoRespons = z.object({
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
type UserInfoDto = z.infer<typeof UserInfoRespons>;
type UserInfo = UserInfoDto & {
    loaded: boolean;
};
function expBackoff(retryCount: number) {
    return ~~((Math.random() + 0.5) * (1 << Math.min(retryCount, 8))) * 100;
}
export const useUserInfo = (): UserInfo => {
    const [exhausted, setExhausted] = useState(false);
    const { data, error, isLoading, isValidating } = useSWR(
        '/min-side-arbeidsgiver/api/userInfo/v1',
        fetcher,
        {
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if (retryCount == 5) {
                    Sentry.captureMessage(
                        `hent userInfo fra min-side-arbeidsgiver feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                    setExhausted(true);
                }
                setTimeout(() => revalidate({ retryCount }), expBackoff(retryCount));
            },
            fallbackData: {
                organisasjoner: [],
                tilganger: Record.map(altinntjeneste, () => Set<string>()),
                altinnError: false,
            },
        }
    );
    const finished = error === undefined && !isLoading && !isValidating;
    return {
        ...data,
        altinnError: data.altinnError || error !== undefined,
        loaded: finished || exhausted,
    };
};

const fetcher = async (url: string) => {
    const respons = await fetch(url);

    if (respons.status !== 200) throw respons;

    return UserInfoRespons.parse(await respons.json());
};
