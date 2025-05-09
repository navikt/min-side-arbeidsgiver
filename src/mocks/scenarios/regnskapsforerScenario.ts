import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { orgnr } from '../brukerApi/helpers';
import { fromEntries } from '../../utils/Record';
import { Merkelapp } from '../brukerApi/alleMerkelapper';
import { brukerApiHandlers } from '../brukerApi/resolvers';
import { nærmesteLederOrganisasjon } from './nærmesteLederScenario';

const tilganger = [
    '4936:1', // inntektsmelding
    '5902:1', // yrkesskade
    '5384:1', // ekspertbistand
    '4826:1', // utsendtArbeidstakerEØS
];

export const regnskapsforerOrganisasjoner = Array.from({ length: 100 }).map(() => ({
    orgnr: orgnr(),
    navn: faker.company.name(),
    organisasjonsform: 'AS',
    underenheter: Array.from({
        length: faker.number.int({ min: 0, max: 5 }),
    }).map(() => ({
        orgnr: orgnr(),
        underenheter: [],
        navn: faker.company.name(),
        organisasjonsform: 'BEDR',
    })),
}));

const alleUnderenheter = regnskapsforerOrganisasjoner.flatMap((org) => org.underenheter);

const regnskapsforerUserInfoScenario = http.get('/min-side-arbeidsgiver/api/userInfo/v3', () => {
    return HttpResponse.json({
        altinnError: false,
        organisasjoner: regnskapsforerOrganisasjoner,
        tilganger: fromEntries(
            tilganger.map((tilgang) => [tilgang, alleUnderenheter.map((org) => org.orgnr)])
        ),
        digisyfoError: false,
        digisyfoOrganisasjoner: [],
        refusjoner: alleUnderenheter.map(({ orgnr }) => ({
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

export const regnskapsforerScenario = [
    regnskapsforerUserInfoScenario,

    ...brukerApiHandlers([nærmesteLederOrganisasjon], (merkelapp) =>
        regnskapsførerSakstyper.includes(merkelapp)
    ),
];
