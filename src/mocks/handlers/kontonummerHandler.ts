import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { KontonummerInput } from '../../Pages/OmVirksomheten/Kontonummer';

export const kontonummerHandlers = [
    http.post<{}, KontonummerInput>('/min-side-arbeidsgiver/api/kontonummer/v1', async ({ request }) => {
        const orgnr = (await request.json()).orgnrForOppslag;
        return HttpResponse.json(
            faker.helpers.maybe(
                () => ({
                    status: 'OK',
                    orgnr: orgnr,
                    kontonummer: faker.number
                        .int({ min: 10000000000, max: 99999999999 })
                        .toString(),
                }),
                { probability: 0.5 }
            ) ??
                faker.helpers.maybe(
                    () => ({
                        status: 'OK',
                        orgnr: '123',
                        kontonummer: faker.number
                            .int({ min: 10000000000, max: 99999999999 })
                            .toString(),
                    }),
                    { probability: 0.5 }
                ) ?? {
                    status: 'MANGLER_KONTONUMMER',
                    orgnr: null,
                    kontonummer: null,
                }
        );
    }),

    http.post('/min-side-arbeidsgiver/api/kontonummerStatus/v1', () =>
        HttpResponse.json({
            status: faker.helpers.maybe(() => 'OK', { probability: 0.99 }) ?? 'MANGLER_KONTONUMMER',
        })
    ),
];
