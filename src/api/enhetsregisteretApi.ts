import * as Sentry from '@sentry/browser';
import { hentOverordnetEnhetApiLink, hentUnderenhetApiURL } from '../lenker';
import { z } from 'zod';

const Adresse = z.object({
    adresse: z.array(z.string()),
    kommune: z.string(),
    kommunenummer: z.string(),
    land: z.string(),
    landkode: z.string(),
    postnummer: z.string(),
    poststed: z.string(),
}).partial();

const Kode = z.object({
    kode: z.string(),
    beskrivelse: z.string(),
});

const Enhet = z.object({
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
}).partial({
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

export async function hentUnderenhet(orgnr: string): Promise<Enhet | undefined> {
    const respons = await fetch(hentUnderenhetApiURL(orgnr)).catch(_ => undefined);
    if (respons === undefined || !respons.ok) {
        return undefined
    }
    const enhet = await respons.json();

    try {
        return Enhet.parse(enhet)
    } catch (error) {
        Sentry.captureException(error)
        /* We don't know if the parser we introduce with zod is too strict.
         * Untill we have seen that this does not happen, we keep the current,
         * type-unsafe behaviour. When we see that the parser is corrent, we
         * should return undefined, or propagate the error in some other way.
         */
        return enhet
    }
}

export async function hentOverordnetEnhet(orgnr: string): Promise<Enhet | undefined> {
    const respons = await fetch(hentOverordnetEnhetApiLink(orgnr)).catch(_ => undefined);
    if (respons === undefined || !respons.ok) {
        return undefined
    }
    const enhet = await respons.json();

    try {
        return Enhet.parse(enhet)
    } catch (error) {
        Sentry.captureException(error)
        /* We don't know if the parser we introduce with zod is too strict.
         * Untill we have seen that this does not happen, we keep the current,
         * type-unsafe behaviour. When we see that the parser is corrent, we
         * should return undefined, or propagate the error in some other way.
         */
        return enhet
    }
}
