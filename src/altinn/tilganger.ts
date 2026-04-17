import { Altinn3Tilgang } from './tjenester';
import { z } from 'zod';
import useSWR, { mutate } from 'swr';
import { useMemo, useState } from 'react';
import { erStøy } from '../utils/util';

const delegationRequestUrl = `${__BASE_PATH__}/api/delegation-request`;

const DelegationRequestResponse = z.object({
    id: z.string().optional().nullable(),
    status: z
        .enum(['None', 'Draft', 'Pending', 'Approved', 'Rejected', 'Withdrawn'])
        .optional()
        .nullable(),
    type: z.string().optional().nullable(),
    lastUpdated: z.string().optional().nullable(),
    resource: z
        .object({
            id: z.string().optional().nullable(),
            referenceId: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    links: z
        .object({
            detailsLink: z.string().optional().nullable(),
            statusLink: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    from: z
        .object({
            organizationIdentifier: z.string().optional().nullable(),
        })
        .passthrough()
        .optional()
        .nullable(),
    to: z
        .object({
            organizationIdentifier: z.string().optional().nullable(),
        })
        .passthrough()
        .optional()
        .nullable(),
});

export type DelegationRequestResponse = z.infer<typeof DelegationRequestResponse>;

const DelegationRequestRow = z.object({
    id: z.string(),
    orgnr: z.string(),
    resourceReferenceId: z.string(),
    status: z.enum(['None', 'Draft', 'Pending', 'Approved', 'Rejected', 'Withdrawn']),
    opprettet: z.string(),
    sistOppdatert: z.string(),
});

export type DelegationRequestRow = z.infer<typeof DelegationRequestRow>;

const DelegationRequestRows = z.array(DelegationRequestRow);
type DelegationRequestRows = z.infer<typeof DelegationRequestRows>;

export const useDelegationRequests = (): DelegationRequestRows => {
    const [retries, setRetries] = useState(0);
    const { data } = useSWR(delegationRequestUrl, listFetcher, {
        onError: (error) => {
            if (retries === 5 && !erStøy(error)) {
                console.error(
                    `#FARO: hent delegation-requests fra min-side-arbeidsgiver-api feilet med ${
                        error.status !== undefined ? `${error.status} ${error.statusText}` : error
                    }`
                );
            }
            setRetries((x) => x + 1);
        },
        onSuccess: () => setRetries(0),
        fallbackData: [],
        errorRetryInterval: 300,
    });

    return useMemo(() => data ?? [], [JSON.stringify(data)]);
};

const listFetcher = async (url: string): Promise<DelegationRequestRows> => {
    const respons = await fetch(url);
    if (respons.status !== 200) throw respons;
    return DelegationRequestRows.parse(await respons.json());
};

export interface DelegationRequestSkjema {
    orgnr: string;
    altinn3Tilgang: Altinn3Tilgang;
}

interface CreateDelegationRequestDTO {
    to: string;
    resource: {
        referenceId: string;
    };
}

export const opprettDelegationRequest = async (
    skjema: DelegationRequestSkjema
): Promise<DelegationRequestResponse | null> => {
    const dto: CreateDelegationRequestDTO = {
        to: `urn:altinn:organization:identifier-no:${skjema.orgnr}`,
        resource: {
            referenceId: skjema.altinn3Tilgang.ressurs,
        },
    };

    const response = await fetch(delegationRequestUrl, {
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

    const parsed = DelegationRequestResponse.parse(await response.json());
    // refresh persisted list so BeOmTilgang reflects the new request immediately
    await mutate(delegationRequestUrl);
    return parsed;
};
