import { http, HttpResponse } from 'msw';

const vnrTilStatus: { [key: string]: string } = {
    '999999999': 'MANGLER_KONTONUMMER',
};

export const kontonummerStatusHandler = http.post(
    '/min-side-arbeidsgiver/api/kontonummerStatus/v1',
    async ({ request }) => {
        const reqBody = (await request.json()) as { virksomhetsnummer: string };
        return HttpResponse.json({
            status: vnrTilStatus[reqBody.virksomhetsnummer] ?? 'OK',
        });
    }
);
