import { z } from 'zod';

export const Organisasjon = z.object({
    Name: z.string(),
    Type: z.string(),
    OrganizationNumber: z.string(),
    OrganizationForm: z
        .string()
        .nullable()
        .default('')
        .transform((o) => o ?? ''),
    Status: z.string(),
    ParentOrganizationNumber: z
        .string()
        .nullable()
        .default('')
        .transform((o) => o ?? ''),
});

export type Organisasjon = z.infer<typeof Organisasjon>;
