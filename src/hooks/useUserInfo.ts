import { z } from 'zod';
import useSWR from 'swr';
import {
    Altinn2Tilgang,
    Altinn3Tilgang,
    altinntjeneste,
    AltinntjenesteId,
    isAltinn2Tilgang,
} from '../altinn/tjenester';
import * as Record from '../utils/Record';
import { useState } from 'react';
import { erStøy } from '../utils/util';

const RefusjonStatus = z.object({
    virksomhetsnummer: z.string(),
    statusoversikt: z.object({
        KLAR_FOR_INNSENDING: z.number().optional(),
    }),
    tilgang: z.boolean(),
});
export type RefusjonStatus = z.infer<typeof RefusjonStatus>;

/**
 * På sikt vil ressursid være beskrivende og altinntjeneste.id være overflødig/unødvendig
 * Da vil denne mappingen kunne fjernes
 */
const tjenesteTilIdMap: Record<string, AltinntjenesteId> = Record.fromEntries(
    Object.entries(altinntjeneste).map(([key, value]) => [
        isAltinn2Tilgang(value)
            ? (value as Altinn2Tilgang).tjenestekode +
              ':' +
              (value as Altinn2Tilgang).tjenesteversjon
            : (value as Altinn3Tilgang).ressurs,
        key,
    ])
);

const idLookup = (id: string) => tjenesteTilIdMap[id] ?? id;

// recursive type using zod https://zodjs.netlify.app/guide/recursive-types#recursive-types
const BaseAltinnTilgang = z.object({
    orgnr: z.string(),
    navn: z.string(),
    organisasjonsform: z.string(),
});
export type AltinnTilgang = z.infer<typeof BaseAltinnTilgang> & {
    underenheter: AltinnTilgang[];
};
const AltinnTilgang: z.ZodType<AltinnTilgang> = BaseAltinnTilgang.extend({
    underenheter: z.lazy(() => AltinnTilgang.array()),
});
// recursive type using zod https://zodjs.netlify.app/guide/recursive-types#recursive-types
const BaseDigisyfoOrganisasjon = z.object({
    orgnr: z.string(),
    navn: z.string(),
    organisasjonsform: z.string(),
    antallSykmeldte: z.number(),
});
export type DigisyfoOrganisasjon = z.infer<typeof BaseDigisyfoOrganisasjon> & {
    underenheter: DigisyfoOrganisasjon[];
};
const DigisyfoOrganisasjon: z.ZodType<DigisyfoOrganisasjon> = BaseDigisyfoOrganisasjon.extend({
    underenheter: z.lazy(() => DigisyfoOrganisasjon.array()),
});
const UserInfoRespons = z.object({
    altinnError: z.boolean(),
    digisyfoError: z.boolean(),
    organisasjoner: z.array(AltinnTilgang),
    tilganger: z.record(z.string(), z.array(z.string())).transform((tilganger) => {
        return Record.fromEntries(
            Object.entries(tilganger).map(([id, orgnumre]) => [
                idLookup(id),
                [...new Set(orgnumre)],
            ])
        );
    }),
    digisyfoOrganisasjoner: z.array(DigisyfoOrganisasjon),
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
    const { data: userInfo, error } = useSWR(`${__BASE_PATH__}/api/userInfo/v3`, fetcher, {
        onSuccess: () => setRetries(0),
        onError: (error) => {
            if (retries === 5 && !erStøy(error)) {
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
