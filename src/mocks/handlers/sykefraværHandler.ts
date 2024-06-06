import { http, HttpResponse } from 'msw';

export const sykefraværHandler = http.get(
    '/min-side-arbeidsgiver/api/sykefravaerstatistikk/:orgnr',
    () =>
        HttpResponse.json(
            Math.random() > 0.5
                ? {
                      type: 'BRANSJE',
                      label: 'Barnehager',
                      prosent: 15.8,
                  }
                : {
                      type: 'VIRKSOMHET',
                      label: 'MAURA OG KOLBU REGNSKAP',
                      prosent: 10.4,
                  }
        )
);
