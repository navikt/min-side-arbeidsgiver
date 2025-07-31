import { storageHandlers } from './handlers/storageHandler';
import { kontaktinfoHandler } from './handlers/kontaktinfoHandler';
import { http, HttpResponse } from 'msw';
import {
    hentKalenderavtalerResolver,
    hentNotifikasjonerResolver,
    hentSakerResolver,
    sakstyperResolver,
    hentSakByIdResolver,
} from './brukerApi/resolvers';
import { kontonummerHandlers } from './handlers/kontonummerHandler';
import { eregHandlers } from './handlers/eregHandlers';
import { Demoprofil } from '../hooks/useDemoprofil';
import { lagredeFilterHandlers } from './handlers/lagredeFilterHandlers';

/**
 * generelle handlers som har lik oppførsel uavhengig av profil.
 */
export const handlers = (demoprofil: Demoprofil) => [
    // varslingStatusHandler
    http.post('/min-side-arbeidsgiver/api/varslingStatus/v1', () =>
        HttpResponse.json({
            status: 'OK',
            varselTimestamp: '2021-01-01T00:00:00',
            kvittertEventTimestamp: '2021-01-04T00:00:00Z',
        })
    ),

    // altinnTilgangsoknadHandler
    http.get('/min-side-arbeidsgiver/api/altinn-tilgangssoknad', () =>
        HttpResponse.json([
            {
                orgnr: '321988123',
                status: 'Unopened',
                submitUrl: 'https://fake-altinn/send-inn-soknad/',
                serviceCode: '5278',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
            {
                orgnr: '321988123',
                status: 'Created',
                submitUrl: 'https://fake-altinn/send-inn-soknad/',
                serviceCode: '5332',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
            {
                orgnr: '321988123',
                status: 'Unopened',
                submitUrl: '/mock-altinn/skjema/',
                serviceCode: '5516',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
            {
                orgnr: '321988123',
                status: 'Unopened',
                submitUrl: '/mock-altinn/skjema/',
                serviceCode: '5216',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
        ])
    ),

    // eregHandlers
    ...eregHandlers(demoprofil),

    // sykefravaerstatistikkHandler
    http.get('/min-side-arbeidsgiver/api/sykefravaerstatistikk/:orgnr', () =>
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
    ),

    ...kontonummerHandlers,
    ...lagredeFilterHandlers,

    kontaktinfoHandler,

    // brukerApi default tomme data, setter per scenario
    hentSakerResolver([]),
    hentKalenderavtalerResolver([]),
    hentNotifikasjonerResolver([]),
    sakstyperResolver([]),
    hentSakByIdResolver([]),
];
