import { GraphQLHandler, http, HttpHandler, HttpResponse } from 'msw';
import { Demoprofil } from '../hooks/useDemoprofil';
import { nærmesteLederScenario } from './scenarios/nærmesteLederScenario';
import { dagligLederScenario } from './scenarios/dagligLederScenario';
import { regnskapsforerScenario } from './scenarios/regnskapsforerScenario';

export const scenarios: {
    [key: Demoprofil]: (HttpHandler | GraphQLHandler)[];
} = {
    DagligLeder: dagligLederScenario,
    NarmesteLeder: nærmesteLederScenario,
    Regnskapsforer: regnskapsforerScenario,
};
