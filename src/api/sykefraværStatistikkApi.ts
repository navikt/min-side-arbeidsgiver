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
    const url = `/min-side-arbeidsgiver/sykefravaer/${orgnr}/sykefravarshistorikk/legemeldtsykefravarsprosent`;
    const respons = await fetch(url);
    if (respons.ok) {
        try {
            const contentType = respons.headers.get('content-type');
            if (contentType === null || !contentType.includes('application/json')) {
                // midlertidig undersøke hvorfor vi får 200 ok med html fra kallet
                const text = await respons.text();
                Sentry.captureException(`Kall til '${url}' returnerte html ${respons.status}:${respons.statusText} content=${text}`)
                return undefined
            }

            return respons.status === 204 ? undefined : Sykefraværsrespons.parse(await respons.json());
        } catch (error) {
            Sentry.captureException(error)
            return undefined
        }
    }
    throw new Error(`Kall til '${url}' feilet med ${respons.status}:${respons.statusText}`);
}


