import { GraphQLHandler, http, HttpHandler, HttpResponse } from 'msw';
import { Demoprofil } from '../hooks/useDemoprofil';
import { nærmesteLederBrukerApiScenario } from './scenarios/nærmesteLederScenario';

export const scenarios: {
    [key: Demoprofil]: (HttpHandler | GraphQLHandler)[];
} = {
    DagligLeder: [http.post('/collect', () => HttpResponse.json())],
    NarmesteLeder: [nærmesteLederBrukerApiScenario],
    Regnskapsforer: [http.post('/collect', () => HttpResponse.json())],
};
