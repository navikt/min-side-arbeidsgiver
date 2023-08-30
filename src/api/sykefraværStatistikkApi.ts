import {z} from "zod";
import * as Sentry from "@sentry/browser";

const Sykefraværsrespons = z.object({
    type: z.string(),
    label: z.string(),
    prosent: z.number(),
});
export type Sykefraværsrespons = z.infer<typeof Sykefraværsrespons> | undefined;

export async function hentSykefravær(
    orgnr: string,
): Promise<Sykefraværsrespons> {
    const url = `/min-side-arbeidsgiver/api/sykefravaerstatistikk/${orgnr}`;
    const respons = await fetch(url);
    if (respons.ok) {
        try {
            return respons.status === 204 ? undefined : Sykefraværsrespons.parse(await respons.json());
        } catch (error) {
            Sentry.captureException(error)
            return undefined
        }
    }
    throw new Error(`Kall til '${url}' feilet med ${respons.status}:${respons.statusText}`);
}


