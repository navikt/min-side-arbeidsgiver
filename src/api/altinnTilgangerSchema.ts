import { z } from 'zod';

export const RolleSchema = z.object({
    kode: z.string(),
    visningsnavn: z.string(),
});

export type Rolle = z.infer<typeof RolleSchema>;

const BaseAltinnTilgangOrganisasjonSchema = z.object({
    orgnr: z.string(),
    navn: z.string(),
    organisasjonsform: z.string(),
    altinn3Tilganger: z.array(z.string()),
    roller: z.array(RolleSchema),
    tilgangspakker: z.array(z.string()).default([]),
});

export type AltinnTilgangOrganisasjon = z.infer<typeof BaseAltinnTilgangOrganisasjonSchema> & {
    underenheter: AltinnTilgangOrganisasjon[];
};

export const AltinnTilgangOrganisasjonSchema: z.ZodType<AltinnTilgangOrganisasjon, z.ZodTypeDef, unknown> =
    BaseAltinnTilgangOrganisasjonSchema.extend({
        underenheter: z.lazy(() => AltinnTilgangOrganisasjonSchema.array()),
    });

const LocalizedStringSchema = z.object({
    nb: z.string().nullable(),
    nn: z.string().nullable(),
    en: z.string().nullable(),
});

export const RessursMetadataSchema = z.object({
    metadata: z.object({
        identifier: z.string(),
        title: LocalizedStringSchema,
        rightDescription: LocalizedStringSchema,
        resourceType: z.string(),
        status: z.string(),
        delegable: z.boolean(),
    }),
    grantedByRoles: z.array(z.string()),
    grantedByAccessPackages: z.array(z.string()),
});

export type RessursMetadata = z.infer<typeof RessursMetadataSchema>;

export const AccessPackageAreaSchema = z.object({
    urn: z.string(),
    name: z.string(),
    description: z.string(),
});

export const AccessPackageSchema = z.object({
    name: z.string(),
    description: z.string(),
    area: AccessPackageAreaSchema,
});

export type AccessPackage = z.infer<typeof AccessPackageSchema>;

export const AltinnTilgangerResponseSchema = z.object({
    isError: z.boolean(),
    hierarki: z.array(AltinnTilgangOrganisasjonSchema),
    ressursMetadata: z.record(z.string(), RessursMetadataSchema).default({}),
    accessPackages: z.record(z.string(), AccessPackageSchema).default({}),
});

export type AltinnTilgangerResponse = z.infer<typeof AltinnTilgangerResponseSchema>;
