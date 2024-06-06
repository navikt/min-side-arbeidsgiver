import { http, HttpResponse } from 'msw';

export const pamHandlers = [
    http.post('/min-side-arbeidsgiver/stillingsregistrering-api/api/arbeidsgiver/:id', () =>
        HttpResponse.json()
    ),
    http.get('/min-side-arbeidsgiver/stillingsregistrering-api/api/stillinger/numberByStatus', () =>
        HttpResponse.json({
            TIL_GODKJENNING: 17,
            GODKJENT: 0,
            PAABEGYNT: 42,
            TIL_AVSLUTTING: 0,
            AVSLUTTET: 5,
            AVVIST: 0,
            PUBLISERT: 10,
        })
    ),
];
