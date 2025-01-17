import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { orgnr } from '../brukerApi/helpers';
import { fromEntries } from '../../utils/Record';
import { alleSaker } from '../brukerApi/alleSaker';
import { Merkelapp } from '../brukerApi/alleMerkelapper';
import {
    hentKalenderavtalerResolver,
    hentNotifikasjonerResolver,
    hentSakByIdResolver,
    hentSakerResolver,
    sakstyperResolver,
} from '../brukerApi/resolvers';
import { alleKalenderavtaler } from '../brukerApi/alleKalenderavtaler';
import { alleNotifikasjoner } from '../brukerApi/alleNotifikasjoner';

const tilganger = [
    '4936:1', // inntektsmelding
    '5902:1', // yrkesskade
    '5384:1', // ekspertbistand
    '4826:1', // utsendtArbeidstakerEØS
];
const underenheter = Array.from({
    length: faker.number.int({ min: 0, max: 5 }),
}).map(() => ({
    orgnr: orgnr(),
    underenheter: [],
    navn: faker.company.name(),
    organisasjonsform: 'BEDR',
}));

export const regnskapsforerOrganisasjoner = Array.from({ length: 100 }).map(() => ({
    orgnr: orgnr(),
    navn: faker.company.name(),
    organisasjonsform: 'AS',
    underenheter: underenheter,
}));

const regnskapsforerUserInfoScenario = http.get('/min-side-arbeidsgiver/api/userInfo/v2', () => {
    return HttpResponse.json({
        altinnError: false,
        organisasjoner: regnskapsforerOrganisasjoner,
        tilganger: fromEntries(
            tilganger.map((tilgang) => [tilgang, underenheter.map((org) => org.orgnr)])
        ),
        digisyfoError: false,
        digisyfoOrganisasjoner: [],
        refusjoner: underenheter.map(({ orgnr }) => ({
            virksomhetsnummer: orgnr,
            statusoversikt: { KLAR_FOR_INNSENDING: faker.number.int({ min: 0, max: 10 }) },
            tilgang: true,
        })),
    });
});

const regnskapsførerSakstyper = [
    //Merkelapp.Fritak_i_arbeidsgiverperioden,
    Merkelapp.Inntektsmelding,
    Merkelapp.Inntektsmelding_sykepenger,
    Merkelapp.Inntektsmelding_pleiepenger_sykt_barn,
    //Merkelapp.Lønnstilskudd,
    //Merkelapp.Masseoppsigelse,
    //Merkelapp.Permittering,
    //Merkelapp.Sommerjobb,
    //Merkelapp.Yrkesskade,
];

const regnskapsførerSaker = alleSaker.filter(({ merkelapp }) =>
    regnskapsførerSakstyper.includes(merkelapp as Merkelapp)
);
const regnskapsførerKalenderavtaler = alleKalenderavtaler.filter(({ merkelapp }) =>
    regnskapsførerSakstyper.includes(merkelapp as Merkelapp)
);
const regnskapsførerNotifikasjoner = alleNotifikasjoner.filter(({ merkelapp }) =>
    regnskapsførerSakstyper.includes(merkelapp as Merkelapp)
);
export const regnskapsforerScenario = [
    regnskapsforerUserInfoScenario,

    hentSakerResolver(regnskapsførerSaker),
    sakstyperResolver(regnskapsførerSaker.map(({ merkelapp }) => merkelapp as Merkelapp)),
    hentKalenderavtalerResolver(regnskapsførerKalenderavtaler),
    hentNotifikasjonerResolver(regnskapsførerNotifikasjoner),
    hentSakByIdResolver(regnskapsførerSaker),
];
