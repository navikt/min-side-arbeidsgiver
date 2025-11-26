import { z } from 'zod';
import useSWR from 'swr';
import { erStøy } from '../utils/util';

const Adresse = z
    .object({
        adresse: z.string().nullable(),
        kommune: z.string().nullable(),
        kommunenummer: z.string().nullable(),
        land: z.string().nullable(),
        landkode: z.string().nullable(),
        postnummer: z.string().nullable(),
        poststed: z.string().nullable(),
    })
    .partial();

const Kode = z.object({
    kode: z.string(),
    beskrivelse: z.string(),
});

const Underenhet = z.object({
    organisasjonsnummer: z.string(),
    navn: z.string(),
    overordnetEnhet: z.string(),
    organisasjonsform: Kode.nullable(),
    naeringskoder: z.array(z.string()).nullable(),
    postadresse: Adresse.nullable(),
    forretningsadresse: Adresse.nullable(),
    hjemmeside: z.string().nullable(),
    antallAnsatte: z.number().nullable(),
    beliggenhetsadresse: Adresse.nullable(),
});

const Hovedenhet = z.object({
    organisasjonsnummer: z.string(),
    navn: z.string(),
    organisasjonsform: Kode.nullable(),
    naeringskoder: z.array(z.string()).nullable(),
    postadresse: Adresse.nullable(),
    forretningsadresse: Adresse.nullable(),
    hjemmeside: z.string().nullable(),
    overordnetEnhet: z.string().nullable(),
    antallAnsatte: z.number().nullable(),
    beliggenhetsadresse: Adresse.nullable(),
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
                if (!erStøy(error)) {
                    console.error(
                        `#FARO: hent Underenhet fra brreg feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
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
                if (!erStøy(error)) {
                    console.error(
                        `#FARO: hent OverordnetEnhet fra brreg feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
            },
        }
    );
    return data;
};

const fetchHovedenhet = async ({ url, orgnr }: { url: string; orgnr: string }) => {
    const respons = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ orgnr }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!respons.ok) throw respons;
    return Hovedenhet.parse(await respons.json());
};
