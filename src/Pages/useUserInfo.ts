import { z } from 'zod';
import useSWR from 'swr';
import { Organisasjon } from '../altinn/organisasjon';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import * as Record from '../utils/Record';
import { Set } from 'immutable';
import { useState } from 'react';
import { erDriftsforstyrrelse } from '../utils/util';

const DigiSyfoOrganisasjon = z.object({
    organisasjon: Organisasjon,
    antallSykmeldte: z.number(),
});
export type DigiSyfoOrganisasjon = z.infer<typeof DigiSyfoOrganisasjon>;
const RefusjonStatus = z.object({
    virksomhetsnummer: z.string(),
    statusoversikt: z.object({
        KLAR_FOR_INNSENDING: z.number().optional(),
    }),
    tilgang: z.boolean(),
});
export type RefusjonStatus = z.infer<typeof RefusjonStatus>;

const tjenesteTilIdMap: Record<string, AltinntjenesteId> = Record.fromEntries(
    Object.entries(altinntjeneste).map(([key, value]) => [
        value.tjenestekode + ':' + value.tjenesteversjon,
        key,
    ])
);

const idLookup = ({
    tjenestekode,
    tjenesteversjon,
}: {
    tjenestekode: string;
    tjenesteversjon: string;
}) => tjenesteTilIdMap[`${tjenestekode}:${tjenesteversjon}`];

const UserInfoRespons = z.object({
    altinnError: z.boolean(),
    digisyfoError: z.boolean(),
    organisasjoner: z.array(Organisasjon),
    tilganger: z
        .array(
            z.object({
                tjenestekode: z.string(),
                tjenesteversjon: z.string(),
                organisasjoner: z.array(z.string()),
            })
        )
        .transform((tilganger) =>
            Record.fromEntries(tilganger.map((it) => [idLookup(it), Set(it.organisasjoner)]))
        ),
    digisyfoOrganisasjoner: z.array(
        z.object({
            organisasjon: Organisasjon,
            antallSykmeldte: z.number(),
        })
    ),
    refusjoner: z.array(RefusjonStatus),
});
export type UserInfoRespons = z.infer<typeof UserInfoRespons>;

type UseUserInfoResult = {
    userInfo: UserInfoRespons | undefined;
    isError: boolean;
    errorStatus: number | undefined;
};

export const useUserInfo = (): UseUserInfoResult => {
    const [retries, setRetries] = useState(0);
    const { data: userInfo, error } = useSWR(`${__BASE_PATH__}/api/userInfo/v1`, fetcher, {
        onSuccess: () => setRetries(0),
        onError: (error) => {
            if (retries === 5 && !erDriftsforstyrrelse(error.status)) {
                console.error(
                    `#MSA: hent userInfo fra min-side-arbeidsgiver feilet med ${
                        error.status !== undefined ? `${error.status} ${error.statusText}` : error
                    }`
                );
            }
            setRetries((x) => x + 1);
        },
        errorRetryInterval: 100,
    });
    return {
        userInfo,
        isError: userInfo === undefined && retries >= 5,
        errorStatus: error?.status,
    };
};

const fetcher = async (url: string) => {
    const respons = await fetch(url);

    if (respons.status !== 200) throw respons;
    return UserInfoRespons.parse(await respons.json());
};
