import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { act, renderHook } from '@testing-library/react';
import { useLagredeFilter } from './LagreFilter';

describe('Parsing av lagrede filter tests', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('useSaksoversiktContext håndering av remoteStorage håndterer gammel versjon av lagret filter', async () => {
        server.use(
            http.get(`${__BASE_PATH__}/api/storage/lagrede-filter`, () => {
                return HttpResponse.json([
                    {
                        uuid: '147ec969-16a9-4dec-8360-6509d7cc653c',
                        navn: 'fager - uløste oppgaver',
                        filter: {
                            route: '/saksoversikt',
                            side: 1,
                            tekstsoek: '',
                            virksomheter: [],
                            sortering: 'NYESTE',
                            sakstyper: ['fager'],
                            oppgaveTilstand: ['NY'],
                        },
                    },
                    {
                        uuid: '147ec969-16a9-4dec-8360-6509d7cc653c',
                        navn: 'fager - uløste oppgaver',
                        filter: {
                            route: '/saksoversikt',
                            side: 1,
                            tekstsoek: '',
                            virksomheter: [],
                            sakstyper: ['fager'],
                            oppgaveFilter: ['TILSTAND_NY_MED_PAAMINNELSE_UTLOEST'],
                        },
                    },
                    {
                        uuid: '147ec969-16a9-4dec-8360-6509d7cc653c',
                        navn: 'fager - uløste oppgaver',
                        filter: {
                            route: '/saksoversikt',
                            side: 1,
                            tekstsoek: '',
                            sakstyper: ['fager'],
                            oppgaveFilter: ['TILSTAND_UTFOERT'],
                        },
                    },
                ]);
            })
        );
        vi.useFakeTimers();
        renderHook(() => useLagredeFilter());
        await act(async () => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });
    });
});



const server = setupServer(
    http.get(`${__BASE_PATH__}/api/altinn-tilgangssoknad`, () => HttpResponse.json([]))
);
