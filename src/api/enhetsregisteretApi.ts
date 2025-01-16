import { z } from 'zod';
import useSWR from 'swr';

const Adresse = z
    .object({
        adresse: z.array(z.string()),
        kommune: z.string(),
        kommunenummer: z.string(),
        land: z.string(),
        landkode: z.string(),
        postnummer: z.string(),
        poststed: z.string(),
    })
    .partial();

const Kode = z.object({
    kode: z.string(),
    beskrivelse: z.string(),
});

const Underenhet = z
    .object({
        organisasjonsnummer: z.string(),
        navn: z.string(),
        organisasjonsform: Kode,
        naeringskoder: z.array(z.string()),
        postadresse: Adresse,
        forretningsadresse: Adresse,
        hjemmeside: z.string(),
        overordnetEnhet: z.string(),
        antallAnsatte: z.number(),
        beliggenhetsadresse: Adresse,
    })
    .partial({
        organisasjonsform: true,
        naeringskoder: true,
        postadresse: true,
        forretningsadresse: true,
        hjemmeside: true,
        antallAnsatte: true,
        beliggenhetsadresse: true,
    });

const Hovedenhet = z
    .object({
        organisasjonsnummer: z.string(),
        navn: z.string(),
        organisasjonsform: Kode,
        naeringskoder: z.array(z.string()),
        postadresse: Adresse,
        forretningsadresse: Adresse,
        hjemmeside: z.string(),
        overordnetEnhet: z.string(),
        antallAnsatte: z.number(),
        beliggenhetsadresse: Adresse,
    })
    .partial({
        organisasjonsform: true,
        naeringskoder: true,
        postadresse: true,
        forretningsadresse: true,
        hjemmeside: true,
        overordnetEnhet: true,
        antallAnsatte: true,
        beliggenhetsadresse: true,
    });

export type Hovedenhet = z.infer<typeof Hovedenhet>;
export type Underenhet = z.infer<typeof Underenhet>;

export const useUnderenhet = (
    orgnr: string | undefined
): { underenhet: Underenhet | undefined; isLoading: boolean } => {
    const { data: underenhet, isLoading } = useSWR(
        orgnr === undefined ? null : { url: `${__BASE_PATH__}/api/ereg/underenhet`, orgnr },
        fetchUnderenhet,
        {
            onError: (error) => {
                console.error(
                    `#MSA: hent Underenhet fra brreg feilet med ${
                        error.status !== undefined ? `${error.status} ${error.statusText}` : error
                    }`
                );
            },
        }
    );
    return { underenhet, isLoading };
};

const fetchUnderenhet = async ({ url, orgnr }: { url: string; orgnr: string }) => {
    const respons = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ orgnr }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!respons.ok) throw respons;
    return Underenhet.parse(await respons.json());
};

export const useOverordnetEnhet = (orgnr: string | undefined): Hovedenhet | undefined => {
    const { data } = useSWR(
        orgnr === undefined ? null : { url: `${__BASE_PATH__}/api/ereg/overenhet`, orgnr },
        fetchHovedenhet,
        {
            onError: (error) => {
                console.error(
                    `#MSA: hent OverordnetEnhet fra brreg feilet med ${
                        error.status !== undefined ? `${error.status} ${error.statusText}` : error
                    }`
                );
            },
        }
    );
    return data;
};

const fetchHovedenhet = async ({ url, orgnr }: { url: string; orgnr: string }) => {
    const respons = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ orgnr }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!respons.ok) throw respons;
    return Hovedenhet.parse(await respons.json());
};
