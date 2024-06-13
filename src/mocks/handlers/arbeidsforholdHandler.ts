import { http, HttpResponse } from 'msw';

const delay = (millis: number) => new Promise((resolve) => setTimeout(resolve, millis));

export const arbeidsforholdHandler = http.get(
    '/min-side-arbeidsgiver/arbeidsgiver-arbeidsforhold-api/antall-arbeidsforhold',
    async () =>
        HttpResponse.json({
            first: '131488434',
            second: Math.random() < 0.1 ? -1 : 502,
        })
);
