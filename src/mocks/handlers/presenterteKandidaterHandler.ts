import { http, HttpResponse } from 'msw';

export const presenterteKandidaterHandler = http.get(
    '/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater',
    () => {
        if (Math.random() < 0.1) {
            return new HttpResponse(null, {
                status: 502,
            });
        }

        return HttpResponse.json({
            antallKandidater: Math.floor(Math.random() * 10),
        });
    }
);
