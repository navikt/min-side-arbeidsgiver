import { z } from 'zod';
import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/react';

const Oversikt = z.object({
    second: z.number().optional(),
});

export async function hentAntallArbeidsforholdFraAareg(
    underenhet: string,
    enhet: string
): Promise<number> {
    const respons = await fetch('/min-side-arbeidsgiver/antall-arbeidsforhold', {
        headers: {
            jurenhet: enhet,
            orgnr: underenhet,
        },
    });

    if (!respons.ok) {
        Sentry.captureMessage(
            `hent antall arbeidsforhold fra aareg feilet med ${respons.status}`,
            Severity.Warning
        );
        return -1;
    }

    try {
        const { second = 0 } = Oversikt.parse(await respons.json());
        return second === 0 ? -1 : second;
    } catch (error) {
        Sentry.captureException(error);
        return -1;
    }
}
