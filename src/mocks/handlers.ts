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
import { altinnTilgangerHandler } from './handlers/altinnTilgangerHandler';

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

    // delegationRequestHandler
    http.post('/min-side-arbeidsgiver/api/delegation-request', () =>
        HttpResponse.json(
            {
                id: '1a9e3a32-252b-4d81-a23c-ed0d86b852c7',
                status: 'Pending',
                type: 'resource',
                lastUpdated: '2025-01-01T00:00:00Z',
                resource: {
                    referenceId: 'nav_example_resource',
                },
                links: {
                    detailsLink:
                        'https://altinn.no/ui/delegation-request/1a9e3a32-252b-4d81-a23c-ed0d86b852c7',
                },
            },
            { status: 202 }
        )
    ),
    http.get('/min-side-arbeidsgiver/api/delegation-request', () => HttpResponse.json([])),

    // eregHandlers
    ...eregHandlers(demoprofil),

    altinnTilgangerHandler,

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
