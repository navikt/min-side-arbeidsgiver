import { http, HttpResponse } from 'msw';
import { orgnr } from '../brukerApi/helpers';
import { faker } from '@faker-js/faker';
import { brukerApiHandlers } from '../brukerApi/resolvers';
import { Merkelapp } from '../brukerApi/alleMerkelapper';

const nærmesteLederMerkelapper = [Merkelapp.Dialogmøte, Merkelapp.Oppfølging];

const underenheter = [
    {
        orgnr: orgnr(),
        navn: faker.company.name(),
        organisasjonsform: 'BEDR',
        underenheter: [],
    },
    {
        orgnr: orgnr(),
        navn: faker.company.name(),
        organisasjonsform: 'BEDR',
        underenheter: [],
    },
];
export const nærmesteLederOrganisasjon = {
    orgnr: orgnr(),
    navn: faker.company.name(),
    organisasjonsform: 'AS',
    underenheter,
};

export const nærmesteLederScenario = [
    http.get('/min-side-arbeidsgiver/api/userInfo/v3', () => {
        return HttpResponse.json({
            altinnError: false,
            organisasjoner: [], // Ingen organisasjoner fra Altinn
            tilganger: {},
            digisyfoError: false,
            digisyfoOrganisasjoner: [
                {
                    ...nærmesteLederOrganisasjon,
                    antallSykmeldte: faker.number.int({ min: 0, max: 10 }),
                    underenheter: nærmesteLederOrganisasjon.underenheter.map((o) => ({
                        ...o,
                        antallSykmeldte: faker.number.int({ min: 0, max: 10 }),
                    })),
                },
            ],
            refusjoner: [],
        });
    }),

    // brukerApi
    ...brukerApiHandlers([nærmesteLederOrganisasjon], (merkelapp) =>
        nærmesteLederMerkelapper.includes(merkelapp)
    ),
];
