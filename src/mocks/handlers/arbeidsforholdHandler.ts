import { http, HttpResponse } from 'msw';

export const arbeidsforholdHandler = http.get(
    '/min-side-arbeidsgiver/arbeidsgiver-arbeidsforhold-api/antall-arbeidsforhold',
    async () =>
        HttpResponse.json({
            first: '131488434',
            second: 42,
        })
);
