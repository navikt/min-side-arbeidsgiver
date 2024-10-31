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
import { alleKalenderavtaler } from '../brukerApi/alleKalenderavtaler';
import { alleNotifikasjoner } from '../brukerApi/alleNotifikasjoner';
import { alleMerkelapper, Merkelapp } from '../brukerApi/alleMerkelapper';

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
    hentSakerResolver(
        alleSaker.filter(({ merkelapp }) =>
            [Merkelapp.Dialogmøte, Merkelapp.Oppfølging].includes(merkelapp as Merkelapp)
        )
    ),

    hentNotifikasjonerResolver(
        alleNotifikasjoner.filter(({ merkelapp }) =>
            [Merkelapp.Dialogmøte, Merkelapp.Oppfølging].includes(merkelapp as Merkelapp)
        )
    ),

    sakstyperResolver([Merkelapp.Dialogmøte, Merkelapp.Oppfølging]),
];
