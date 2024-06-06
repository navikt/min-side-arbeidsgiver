import { http, HttpResponse } from 'msw';

export const varslingStatusHandler = http.post('/min-side-arbeidsgiver/api/varslingStatus/v1', () =>
    HttpResponse.json({
        status: Math.random() < 0.1 ? 'MANGLER_KOFUVI' : 'OK',
        varselTimestamp: '2021-01-01T00:00:00',
        kvittertEventTimestamp: '2021-01-04T00:00:00Z',
    })
);
