import { z } from 'zod';
import { gittMiljo } from '../utils/environment';
import useSWR from 'swr';

export const hentUnderenhetApiURL = (orgnr: string) =>
    gittMiljo({
        prod: `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`,
        other: `${__BASE_PATH__}/mock/data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`,
    });

const hentOverordnetEnhetApiLink = (orgnr: string) =>
    gittMiljo({
        prod: `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`,
        other: `${__BASE_PATH__}/mock/data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`,
    });

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
        naeringskode1: Kode,
        naeringskode2: Kode,
        naeringskode3: Kode,
        postadresse: Adresse,
        forretningsadresse: Adresse,
        hjemmeside: z.string(),
        overordnetEnhet: z.string(),
        harRegistrertAntallAnsatte: z.boolean(),
        antallAnsatte: z.number(),
        beliggenhetsadresse: Adresse,
        institusjonellSektorkode: Kode,
    })
    .partial({
        organisasjonsform: true,
        naeringskode1: true,
        naeringskode2: true,
        naeringskode3: true,
        postadresse: true,
        forretningsadresse: true,
        hjemmeside: true,
        harRegistrertAntallAnsatte: true,
        antallAnsatte: true,
        beliggenhetsadresse: true,
        institusjonellSektorkode: true,
    });

const Hovedenhet = z
    .object({
        organisasjonsnummer: z.string(),
        navn: z.string(),
        organisasjonsform: Kode,
        naeringskode1: Kode,
        naeringskode2: Kode,
        naeringskode3: Kode,
        postadresse: Adresse,
        forretningsadresse: Adresse,
        hjemmeside: z.string(),
        overordnetEnhet: z.string(),
        antallAnsatte: z.number(),
        beliggenhetsadresse: Adresse,
        institusjonellSektorkode: Kode,
    })
    .partial({
        organisasjonsform: true,
        naeringskode1: true,
        naeringskode2: true,
        naeringskode3: true,
        postadresse: true,
        forretningsadresse: true,
        hjemmeside: true,
        overordnetEnhet: true,
        antallAnsatte: true,
        beliggenhetsadresse: true,
        institusjonellSektorkode: true,
    });

export type Hovedenhet = z.infer<typeof Hovedenhet>;
export type Underenhet = z.infer<typeof Underenhet>;

export const useUnderenhet = (
    orgnr: string | undefined
): { underenhet: Underenhet | undefined; isLoading: boolean } => {
    const { data: underenhet, isLoading } = useSWR(
        orgnr === undefined ? null : hentUnderenhetApiURL(orgnr),
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

const fetchUnderenhet = async (url: string) => {
    const respons = await fetch(url);
    if (!respons.ok) throw respons;
    return Underenhet.parse(await respons.json());
};

export const useOverordnetEnhet = (orgnr: string | undefined): Hovedenhet | undefined => {
    const { data } = useSWR(
        orgnr === undefined ? null : hentOverordnetEnhetApiLink(orgnr),
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

const fetchHovedenhet = async (url: string) => {
    const respons = await fetch(url);
    if (!respons.ok) throw respons;
    return Hovedenhet.parse(await respons.json());
};
