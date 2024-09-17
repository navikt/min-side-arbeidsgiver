import { z } from 'zod';

export const Organisasjon = z.object({
    Name: z.string(),
    OrganizationNumber: z.string(),
    OrganizationForm: z
        .string()
        .nullable()
        .default('')
        .transform((o) => o ?? ''),
    ParentOrganizationNumber: z
        .string()
        .nullable()
        .default('')
        .transform((o) => o ?? ''),
});

export type Organisasjon = z.infer<typeof Organisasjon>;
