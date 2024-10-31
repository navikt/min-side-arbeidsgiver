import { http, HttpResponse } from 'msw';
import { orgnr } from '../brukerApi/helpers';
import { faker } from '@faker-js/faker';
import { fromEntries } from '../../utils/Record';
import {
    hentKalenderavtalerResolver,
    hentNotifikasjonerResolver,
    hentSakerResolver,
    sakstyperResolver,
} from '../brukerApi/resolvers';
import { alleSaker } from '../brukerApi/alleSaker';
import { alleNotifikasjoner } from '../brukerApi/alleNotifikasjoner';
import { Merkelapp } from '../brukerApi/alleMerkelapper';
import { alleKalenderavtaler } from '../brukerApi/alleKalenderavtaler';

const nærmesteLederMerkelapper = [Merkelapp.Dialogmøte, Merkelapp.Oppfølging];
const nærmesteLederSaker = alleSaker.filter(({ merkelapp }) =>
    nærmesteLederMerkelapper.includes(merkelapp as Merkelapp)
);
const nærmesteLederNotifikasjoner = alleNotifikasjoner.filter(({ merkelapp }) =>
    nærmesteLederMerkelapper.includes(merkelapp as Merkelapp)
);
const nærmesteLederKalenderavtaler = alleKalenderavtaler.filter(({ merkelapp }) =>
    nærmesteLederMerkelapper.includes(merkelapp as Merkelapp)
);

export const nærmesteLederScenario = [
    http.get('/min-side-arbeidsgiver/api/userInfo/v2', () => {
        const underenheter = [
            {
                orgNr: orgnr(),
                name: faker.company.name(),
                organizationForm: 'BEDR',
                underenheter: [],
            },
            {
                orgNr: orgnr(),
                name: faker.company.name(),
                organizationForm: 'BEDR',
                underenheter: [],
            },
        ];
        const organisasjon = {
            orgNr: orgnr(),
            name: faker.company.name(),
            organizationForm: 'AS',
            underenheter,
        };
        return HttpResponse.json({
            altinnError: false,
            organisasjoner: [organisasjon],
            tilganger: fromEntries(
                [
                    // TODO: skal nærmeste leder ha noen altinn tilganger?
                ].map((tilgang) => [tilgang, underenheter.map((org) => org.orgNr)])
            ),
            digisyfoError: false,
            digisyfoOrganisasjoner: underenheter.map(({ orgNr, organizationForm, name }) => ({
                organisasjon: {
                    OrganizationNumber: orgNr,
                    Name: name,
                    ParentOrganizationNumber: organisasjon.orgNr,
                    OrganizationForm: organizationForm,
                },
                antallSykmeldte: faker.number.int({ min: 0, max: 10 }),
            })),
            refusjoner: [],
        });
    }),

    // brukerApi
    hentSakerResolver(nærmesteLederSaker),
    sakstyperResolver(nærmesteLederSaker.map(({ merkelapp }) => merkelapp as Merkelapp)),
    hentNotifikasjonerResolver(nærmesteLederNotifikasjoner),
    hentKalenderavtalerResolver(nærmesteLederKalenderavtaler),
];
