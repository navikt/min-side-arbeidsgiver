import { z } from 'zod';
import * as Sentry from "@sentry/browser";
import {Severity} from "@sentry/react";

const PresenterteKandidater = z.object({
    antallKandidater: z.number(),
})

export async function hentAntallKandidater(
    orgnr: string,
): Promise<number> {
    const respons = await fetch(
        `/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater?virksomhetsnummer=${orgnr}`,
    );

    if (!respons.ok) {
        Sentry.captureMessage(`hent antall kandidater fra presenterte-kandidater-api feilet med ${respons.status}`, Severity.Warning)
        return 0
    }

    try {
        const {antallKandidater = 0} = PresenterteKandidater.parse(await respons.json())
        return antallKandidater
    } catch (error) {
        Sentry.captureException(error)
        return 0
    }
}

