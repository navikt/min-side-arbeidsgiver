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
        roller: [],
        underenheter: [],
    },
    {
        orgnr: orgnr(),
        navn: faker.company.name(),
        organisasjonsform: 'BEDR',
        roller: [],
        underenheter: [],
    },
];
export const nærmesteLederOrganisasjon = {
    orgnr: orgnr(),
    navn: faker.company.name(),
    organisasjonsform: 'AS',
    roller: [],
    underenheter,
};

const alleOrgnr = [
    nærmesteLederOrganisasjon.orgnr,
    ...underenheter.map((u) => u.orgnr),
];

export const nærmesteLederScenario = [
    http.get('/min-side-arbeidsgiver/api/userInfo/v3', () => {
        return HttpResponse.json({
            altinnError: false,
            organisasjoner: [], // Ingen organisasjoner fra Altinn
            tilganger: {
                'nav_syfo_oppgi-narmesteleder': alleOrgnr,
            },
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

    // Midlertidig endepunkt – team-esyfo lager et mer spesifikt endepunkt senere.
    http.get(
        '/min-side-arbeidsgiver/esyfo-narmesteleder/api/v1/linemanager/requirement',
        () => HttpResponse.json({ meta: { total: 42 } })
    ),

    // brukerApi
    ...brukerApiHandlers([nærmesteLederOrganisasjon], (merkelapp) =>
        nærmesteLederMerkelapper.includes(merkelapp)
    ),
];
