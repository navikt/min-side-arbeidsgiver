import { z } from 'zod';

export const RolleSchema = z.object({
    kode: z.string(),
    visningsnavn: z.string(),
    beskrivelse: z.string().nullable().optional(),
});

export type Rolle = z.infer<typeof RolleSchema>;

const LocalizedStringSchema = z.object({
    nb: z.string().nullable(),
    nn: z.string().nullable(),
    en: z.string().nullable(),
});

const TilgangspakkeAreaSchema = z.object({
    urn: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
});

export const TilgangspakkeSchema = z.object({
    id: z.string(),
    navn: z.string(),
    beskrivelse: z.string().nullable(),
    area: TilgangspakkeAreaSchema.nullable(),
});

export type Tilgangspakke = z.infer<typeof TilgangspakkeSchema>;

export const Altinn3TilgangSchema = z.object({
    ressursId: z.string(),
    navn: LocalizedStringSchema.nullable(),
    beskrivelse: LocalizedStringSchema.nullable(),
    delegertViaRoller: z.array(RolleSchema),
    delegertViaTilgangspakker: z.array(TilgangspakkeSchema),
    erEnkeltrettighet: z.boolean().nullable(),
});

export type Altinn3Tilgang = z.infer<typeof Altinn3TilgangSchema>;

const BaseAltinnTilgangOrganisasjonSchema = z.object({
    orgnr: z.string(),
    navn: z.string(),
    organisasjonsform: z.string(),
    altinn3Tilganger: z.array(Altinn3TilgangSchema),
    roller: z.array(RolleSchema),
    tilgangspakker: z.array(TilgangspakkeSchema).default([]),
});

export type AltinnTilgangOrganisasjon = z.infer<typeof BaseAltinnTilgangOrganisasjonSchema> & {
    underenheter: AltinnTilgangOrganisasjon[];
};

export const AltinnTilgangOrganisasjonSchema: z.ZodType<AltinnTilgangOrganisasjon, z.ZodTypeDef, unknown> =
    BaseAltinnTilgangOrganisasjonSchema.extend({
        underenheter: z.lazy(() => AltinnTilgangOrganisasjonSchema.array()),
    });

export const AltinnTilgangerResponseSchema = z.object({
    isError: z.boolean(),
    hierarki: z.array(AltinnTilgangOrganisasjonSchema),
});

export type AltinnTilgangerResponse = z.infer<typeof AltinnTilgangerResponseSchema>;
