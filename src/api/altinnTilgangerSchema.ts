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
    altinn2Tilganger: z.array(z.string()),
    roller: z.array(RolleSchema),
});

export type AltinnTilgangOrganisasjon = z.infer<typeof BaseAltinnTilgangOrganisasjonSchema> & {
    underenheter: AltinnTilgangOrganisasjon[];
};

export const AltinnTilgangOrganisasjonSchema: z.ZodType<AltinnTilgangOrganisasjon> =
    BaseAltinnTilgangOrganisasjonSchema.extend({
        underenheter: z.lazy(() => AltinnTilgangOrganisasjonSchema.array()),
    });

export const AltinnTilgangerResponseSchema = z.object({
    isError: z.boolean(),
    hierarki: z.array(AltinnTilgangOrganisasjonSchema),
    orgNrTilTilganger: z.record(z.string(), z.array(z.string())),
    tilgangTilOrgNr: z.record(z.string(), z.array(z.string())),
});

export type AltinnTilgangerResponse = z.infer<typeof AltinnTilgangerResponseSchema>;
