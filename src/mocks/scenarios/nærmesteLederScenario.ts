import { http, HttpResponse } from 'msw';
import { orgnr } from '../brukerApi/helpers';
import { faker } from '@faker-js/faker';
import {
    hentKalenderavtalerResolver,
    hentNotifikasjonerResolver,
    hentSakByIdResolver,
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
    http.get('/min-side-arbeidsgiver/api/userInfo/v2', () => {
        return HttpResponse.json({
            altinnError: false,
            organisasjoner: [nærmesteLederOrganisasjon],
            tilganger: {},
            digisyfoError: false,
            digisyfoOrganisasjoner: underenheter.map(({ orgnr, organisasjonsform, navn }) => ({
                organisasjon: {
                    OrganizationNumber: orgnr,
                    Name: navn,
                    ParentOrganizationNumber: nærmesteLederOrganisasjon.orgnr,
                    OrganizationForm: organisasjonsform,
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
    hentSakByIdResolver(nærmesteLederSaker),
];
