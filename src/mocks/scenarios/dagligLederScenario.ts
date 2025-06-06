import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { orgnr } from '../brukerApi/helpers';
import { fromEntries } from '../../utils/Record';
import { brukerApiHandlers } from '../brukerApi/resolvers';
import { mapRecursive } from '../../utils/util';

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
    '5516:6', // vtao
    'nav_forebygge-og-redusere-sykefravar_sykefravarsstatistikk', // sykefravarstatistikk
    'nav_forebygge-og-redusere-sykefravar_samarbeid', // forebyggefravar
    '5078:1', // rekruttering
    '5278:1', // tilskuddsbrev
    '5902:1', // yrkesskade
    '5902:1', // yrkesskade
    '2896:87', // endreBankkontonummerForRefusjoner
];
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

const orgledd = {
    orgnr: orgnr(),
    navn: faker.company.name(),
    organisasjonsform: 'ORGL',
    underenheter: [
        {
            orgnr: orgnr(),
            navn: faker.company.name(),
            organisasjonsform: 'ORGL',
            underenheter: underenheter.slice(0, 1),
        },
    ],
};
export const dagligLederOrganisasjon = {
    orgnr: orgnr(),
    navn: faker.company.name(),
    organisasjonsform: 'AS',
    underenheter: [...underenheter.slice(1), orgledd],
};
const hestemannen = {
    orgnr: '994884344',
    organisasjonsform: 'FLI',
    navn: 'HESTMANNEN UNGDOMS- OG IDRETTSLAG',
    altinn3Tilganger: [],
    altinn2Tilganger: [],
    underenheter: [],
};

export const dagligLederScenario = [
    http.get('/min-side-arbeidsgiver/api/userInfo/v3', () => {
        return HttpResponse.json({
            altinnError: false,
            organisasjoner: [hestemannen, dagligLederOrganisasjon],
            tilganger: fromEntries(
                alleTilganger.map((tilgang) => [
                    tilgang,
                    [
                        '994884344',
                        dagligLederOrganisasjon.orgnr,
                        ...underenheter.map((org) => org.orgnr),
                    ],
                ])
            ),
            digisyfoError: false,
            digisyfoOrganisasjoner: mapRecursive([dagligLederOrganisasjon], (org) => ({
                ...org,
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
                    'VTAO',
                ]),
            }))
        )
    ),

    // brukerApi
    ...brukerApiHandlers([dagligLederOrganisasjon], (_) => true),
];
