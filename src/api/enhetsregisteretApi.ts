import * as Sentry from '@sentry/browser';
import { z } from 'zod';
import { gittMiljo } from '../utils/environment';
import useSWR from 'swr';

export const hentUnderenhetApiURL = (orgnr: string) =>
    gittMiljo({
        prod: `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`,
        dev: `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`,
        other: `/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`,
    });

const hentOverordnetEnhetApiLink = (orgnr: string) =>
    gittMiljo({
        prod: `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`,
        dev: `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`,
        other: `/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`,
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

const Enhet = z
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

export type Enhet = z.infer<typeof Enhet>;

async function fetcher(underenhetUrl: string): Promise<Enhet | undefined> {
    try {
        const respons = await fetch(underenhetUrl);
        if (respons.status === 200) {
            const enhet = await respons.json();
            return Enhet.parse(enhet);
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
}

export const useHentUnderenhet = (orgnr: string) => {
    return useSWR(hentUnderenhetApiURL(orgnr), fetcher).data;
};

export const useHentOverordnetEnhet = (orgnr: string) => {
    return useSWR(hentOverordnetEnhetApiLink(orgnr), fetcher).data;
};
