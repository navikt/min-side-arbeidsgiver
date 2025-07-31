import { http, HttpResponse } from 'msw';
import { SaksoversiktLagretFilter } from '../../Pages/Saksoversikt/SaksoversiktProvider';
import { SakSortering } from '../../api/graphql-types';
import { Set } from 'immutable';

let lagredeFilter: SaksoversiktLagretFilter[] = [
    {
        filterId: '147ec969-16a9-4dec-8360-6509d7cc653c',
        navn: 'filter-1',
        side: 1,
        tekstsoek: '',
        virksomheter: Set(),
        sortering: SakSortering.NyesteFørst,
        sakstyper: [],
        oppgaveFilter: [],
    },
];

export const lagredeFilterHandlers = [
    http.get('/min-side-arbeidsgiver/api/lagredeFilter', () => {
        return HttpResponse.json(lagredeFilter, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }),
    http.put<any, SaksoversiktLagretFilter>(
        '/min-side-arbeidsgiver/api/lagredeFilter',
        async ({ request }) => {
            const newFilter = await request.json();
            const existingIndex = lagredeFilter.findIndex(
                (filter) => filter.filterId === newFilter.filterId
            );
            if (existingIndex !== -1) {
                // Update existing filter
                lagredeFilter[existingIndex] = newFilter;
            } else {
                lagredeFilter.push(newFilter);
            }
            return HttpResponse.json(lagredeFilter, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    ),
    http.delete('/min-side-arbeidsgiver/api/lagredeFilter/:filterId', ({ params }) => {
        const filterId = params.filterId;
        lagredeFilter = lagredeFilter.filter((filter) => filter.filterId !== filterId);
        return HttpResponse.json(
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }),
];
