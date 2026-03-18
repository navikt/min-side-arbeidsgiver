import { Altinn3Tilgang } from './tjenester';
import { z } from 'zod';

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

    return DelegationRequestResponse.parse(await response.json());
};
