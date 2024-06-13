import { http, HttpResponse } from 'msw';

export const kontonummerStatusHandler = http.post(
    '/min-side-arbeidsgiver/api/kontonummerStatus/v1',
    () =>
        HttpResponse.json({
            status: 'OK',
        })
);
