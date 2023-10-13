import { z } from 'zod';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { Organisasjon } from '../altinn/organisasjon';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import * as Record from '../utils/Record';
import { Set } from 'immutable';
import { useState } from 'react';

const DigiSyfoOrganisasjon = z.object({
    organisasjon: Organisasjon,
    antallSykmeldte: z.number(),
});
export type DigiSyfoOrganisasjon = z.infer<typeof DigiSyfoOrganisasjon>;
const UserInfoRespons = z.object({
    altinnError: z.boolean(),
    digisyfoError: z.boolean(),
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
    digisyfoOrganisasjoner: z.array(
        z.object({
            organisasjon: Organisasjon,
            antallSykmeldte: z.number(),
        })
    ),
});
type UserInfoDto = z.infer<typeof UserInfoRespons>;
type UserInfo = UserInfoDto & {
    loaded: boolean;
};
export const useUserInfo = (): UserInfo => {
    const [retries, setRetries] = useState(0);
    const { data, error, isLoading, isValidating } = useSWR(
        '/min-side-arbeidsgiver/api/userInfo/v1',
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (retries === 5) {
                    Sentry.captureMessage(
                        `hent userInfo fra min-side-arbeidsgiver feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
                setRetries((x) => x + 1);
            },
            errorRetryInterval: 100,
            fallbackData: {
                organisasjoner: [],
                digisyfoOrganisasjoner: [],
                tilganger: Record.map(altinntjeneste, () => Set<string>()),
                altinnError: false,
                digisyfoError: false,
            },
        }
    );
    const finished = error === undefined && !isLoading && !isValidating;
    const exhausted = retries >= 5;
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
