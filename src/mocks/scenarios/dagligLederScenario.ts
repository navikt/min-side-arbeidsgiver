import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { fromEntries } from '../../utils/Record';
import { brukerApiHandlers } from '../brukerApi/resolvers';
import { mapRecursive } from '../../utils/util';

const alleTilganger = [
    'nav_foreldrepenger_inntektsmelding',
    'nav_sykepenger_inntektsmelding',
    'nav_sykepenger_fritak-arbeidsgiverperiode',
    'nav_sykdom-i-familien_inntektsmelding',
    'nav_tiltak_ekspertbistand',
    'nav_arbeidsforhold_aa-registeret-innsyn-arbeidsgiver', // arbeidsforhold
    '4826:1', // utsendtArbeidstakerEØS
    '5332:1', // arbeidstrening
    '5516:1', // midlertidigLønnstilskudd
    '5516:2', // varigLønnstilskudd
    '5516:3', // sommerjobb
    '5516:4', // mentortilskudd
    '5516:5', // inkluderingstilskudd
    '5516:6', // vtao
    'nav_forebygge-og-redusere-sykefravar_sykefravarsstatistikk', // sykefravarstatistikk
    'nav_rekruttering_kandidater', // rekruttering
    'nav_rekruttering_stillingsannonser', // stillingsannonser arbeidsplassen.no
    'nav_permittering-og-nedbemmaning_innsyn-i-alle-innsendte-meldinger',
    '5278:1', // tilskuddsbrev
    'nav_yrkesskade_skademelding',
    'nav_utbetaling_endre-kontonummer-refusjon-arbeidsgiver',
    'nav_arbeidsforhold_aa-registeret-innsyn-arbeidsgiver',
    'nav_syfo_oppgi-narmesteleder',
    'nav_tiltak_ekspertbistand', // ekspertbistand
];
const underenheter = [
    {
        orgnr: '100000001',
        underenheter: [],
        navn: 'Eksempel AAFY',
        organisasjonsform: 'AAFY',
        roller: ['LEDE'],
    },
    {
        orgnr: '100000002',
        underenheter: [],
        navn: 'Eksempel FLI',
        organisasjonsform: 'FLI',
        roller: [],
    },
    {
        orgnr: '100000003',
        navn: 'Eksempel BEDR',
        organisasjonsform: 'BEDR',
        roller: [],
        underenheter: [],
    },
];

const orgledd = {
    orgnr: '100000010',
    navn: 'Eksempel ORGL',
    organisasjonsform: 'ORGL',
    roller: [],
    underenheter: [
        {
            orgnr: '100000011',
            navn: 'Eksempel ORGL underenhet',
            organisasjonsform: 'ORGL',
            roller: [],
            underenheter: underenheter.slice(0, 1),
        },
    ],
};
export const dagligLederOrganisasjon = {
    orgnr: '100000020',
    navn: 'Eksempel AS',
    organisasjonsform: 'AS',
    roller: ['DAGL', 'LEDE'],
    underenheter: [...underenheter.slice(1), orgledd],
};
const hestemannen = {
    orgnr: '994884344',
    organisasjonsform: 'FLI',
    navn: 'HESTMANNEN UNGDOMS- OG IDRETTSLAG',
    roller: [],
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
