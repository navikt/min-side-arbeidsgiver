import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { orgnr } from '../brukerApi/helpers';
import { fromEntries } from '../../utils/Record';
import {
    hentKalenderavtalerResolver,
    hentNotifikasjonerResolver,
    hentSakerResolver,
    sakstyperResolver,
    hentSakByIdResolver,
} from '../brukerApi/resolvers';
import { alleSaker } from '../brukerApi/alleSaker';
import { alleKalenderavtaler } from '../brukerApi/alleKalenderavtaler';
import { alleNotifikasjoner } from '../brukerApi/alleNotifikasjoner';
import { Merkelapp } from '../brukerApi/alleMerkelapper';

const alleTilganger = [
    '5216:1', // sykefraværsstatistikk
    '4936:1', // inntektsmelding
    '5384:1', // ekspertbistand
    '4826:1', // utsendtArbeidstakerEØS
    '5332:1', // arbeidstrening
    '5441:1', // arbeidsforhold
    '5516:1', // midlertidigLønnstilskudd
    '5516:2', // varigLønnstilskudd
    '5516:3', // sommerjobb
    '5516:4', // mentortilskudd
    '5516:5', // inkluderingstilskudd
    '3403:1', // sykefravarstatistikk
    '5934:1', // forebyggefravar
    '5078:1', // rekruttering
    '5278:1', // tilskuddsbrev
    '5902:1', // yrkesskade
];

export const dagligLederScenario = [
    http.get('/min-side-arbeidsgiver/api/userInfo/v2', () => {
        const underenheter = [
            {
                orgnr: orgnr(),
                underenheter: [],
                navn: faker.company.name(),
                organisasjonsform: 'AAFY',
            },
            {
                orgnr: orgnr(),
                underenheter: [],
                navn: faker.company.name(),
                organisasjonsform: 'FLI',
            },
            {
                orgnr: orgnr(),
                navn: faker.company.name(),
                organisasjonsform: 'BEDR',
                underenheter: [],
            },
        ];
        const organisasjon = {
            orgnr: orgnr(),
            navn: faker.company.name(),
            organisasjonsform: 'AS',
            underenheter,
        };
        return HttpResponse.json({
            altinnError: false,
            organisasjoner: [organisasjon],
            tilganger: fromEntries(
                alleTilganger.map((tilgang) => [tilgang, underenheter.map((org) => org.orgnr)])
            ),
            digisyfoError: false,
            digisyfoOrganisasjoner: underenheter.map(({ orgnr, organisasjonsform, navn }) => ({
                organisasjon: {
                    OrganizationNumber: orgnr,
                    Name: navn,
                    ParentOrganizationNumber: organisasjon.orgnr,
                    OrganizationForm: organisasjonsform,
                },
                antallSykmeldte: faker.number.int({ min: 0, max: 10 }),
            })),
            refusjoner: underenheter.map(({ orgnr }) => ({
                virksomhetsnummer: orgnr,
                statusoversikt: {
                    KLAR_FOR_INNSENDING: faker.number.int({ min: 0, max: 10 }),
                    FOR_TIDLIG: faker.number.int({ min: 0, max: 10 }),
                },
                tilgang: true,
            })),
        });
    }),

    // stillingsregistrering / pam / arbeidsplassen
    http.post('/min-side-arbeidsgiver/stillingsregistrering-api/api/arbeidsgiver/:id', () =>
        HttpResponse.json()
    ),
    http.get('/min-side-arbeidsgiver/stillingsregistrering-api/api/stillinger/numberByStatus', () =>
        HttpResponse.json({
            TIL_GODKJENNING: faker.number.int({ min: 0, max: 20 }),
            GODKJENT: faker.number.int({ min: 0, max: 20 }),
            PAABEGYNT: faker.number.int({ min: 0, max: 20 }),
            TIL_AVSLUTTING: faker.number.int({ min: 0, max: 20 }),
            AVSLUTTET: faker.number.int({ min: 0, max: 20 }),
            AVVIST: faker.number.int({ min: 0, max: 20 }),
            PUBLISERT: faker.number.int({ min: 0, max: 20 }),
        })
    ),

    // presenterte-kandidater / Kandidatlister
    http.get('/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater', () => {
        if (Math.random() < 0.1) {
            return new HttpResponse(null, {
                status: 502,
            });
        }

        return HttpResponse.json({
            antallKandidater: Math.floor(Math.random() * 10),
        });
    }),

    http.get(
        '/min-side-arbeidsgiver/arbeidsgiver-arbeidsforhold-api/antall-arbeidsforhold',
        async () =>
            HttpResponse.json({
                first: '131488434',
                second: 42,
            })
    ),

    //  tiltaksgjennomforing / TiltakAvtaler
    http.get('/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler/*', () =>
        HttpResponse.json(
            Array.from({ length: 66 }).map(() => ({
                tiltakstype: faker.helpers.arrayElement([
                    'ARBEIDSTRENING',
                    'MIDLERTIDIG_LONNSTILSKUDD',
                    'VARIG_LONNSTILSKUDD',
                    'SOMMERJOBB',
                    'INKLUDERINGSTILSKUDD',
                    'MENTOR',
                ]),
            }))
        )
    ),

    // brukerApi
    hentSakerResolver(alleSaker),
    sakstyperResolver(alleSaker.map(({ merkelapp }) => merkelapp as Merkelapp)),
    hentKalenderavtalerResolver(alleKalenderavtaler),
    hentNotifikasjonerResolver(alleNotifikasjoner),
    hentSakByIdResolver(alleSaker),
];
