// src/mocks/node.js
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// TODO: mock alle swr kall

export const server = setupServer(
    http.get(`http://localhost${__BASE_PATH__}/api/userInfo/v1`, () =>
        HttpResponse.json({
            altinnError: false,
            digisyfoError: false,
            tilganger: [
                {
                    id: 'ekspertbistand',
                    tjenestekode: '5384',
                    tjenesteversjon: '1',
                },
                {
                    id: 'inntektsmelding',
                    tjenestekode: '4936',
                    tjenesteversjon: '1',
                },
                {
                    id: 'utsendtArbeidstakerEØS',
                    tjenestekode: '4826',
                    tjenesteversjon: '1',
                },
                {
                    id: 'arbeidstrening',
                    tjenestekode: '5332',
                    tjenesteversjon: '1',
                },
                {
                    id: 'arbeidsforhold',
                    tjenestekode: '5441',
                    tjenesteversjon: '1',
                },
                {
                    id: 'midlertidigLønnstilskudd',
                    tjenestekode: '5516',
                    tjenesteversjon: '1',
                },
                {
                    id: 'varigLønnstilskudd',
                    tjenestekode: '5516',
                    tjenesteversjon: '2',
                },
                {
                    id: 'sommerjobb',
                    tjenestekode: '5516',
                    tjenesteversjon: '3',
                },
                {
                    id: 'mentortilskudd',
                    tjenestekode: '5516',
                    tjenesteversjon: '4',
                },
                {
                    id: 'inkluderingstilskudd',
                    tjenestekode: '5516',
                    tjenesteversjon: '5',
                },
                {
                    id: 'sykefravarstatistikk',
                    tjenestekode: '3403',
                    tjenesteversjon: '1',
                },
                {
                    id: 'forebyggefravar',
                    tjenestekode: '5934',
                    tjenesteversjon: '1',
                },
                {
                    id: 'rekruttering',
                    tjenestekode: '5078',
                    tjenesteversjon: '1',
                },
                {
                    id: 'tilskuddsbrev',
                    tjenestekode: '5278',
                    tjenesteversjon: '1',
                },
                {
                    id: 'yrkesskade',
                    tjenestekode: '5902',
                    tjenesteversjon: '1',
                },
            ].map((tjeneste) => ({
                ...tjeneste,
                organisasjoner: ['182345674', '118345674'],
            })),
            organisasjoner: [
                {
                    Name: 'BALLSTAD OG HAMARØY',
                    Type: 'Business',
                    OrganizationNumber: '182345674',
                    ParentOrganizationNumber: '118345674',
                    OrganizationForm: 'AAFY',
                    Status: 'Active',
                },
                {
                    Name: 'BALLSTAD OG HORTEN',
                    Type: 'Enterprise',
                    ParentOrganizationNumber: null,
                    OrganizationNumber: '118345674',
                    OrganizationForm: 'FLI',
                    Status: 'Active',
                },
            ],
            digisyfoOrganisasjoner: [
                {
                    organisasjon: {
                        Name: 'BALLSTAD OG HAMARØY',
                        Type: 'Business',
                        OrganizationNumber: '182345674',
                        ParentOrganizationNumber: '118345674',
                        OrganizationForm: 'AAFY',
                        Status: 'Active',
                    },
                    antallSykmeldte: 4,
                },
                {
                    organisasjon: {
                        Name: 'BALLSTAD OG HORTEN',
                        Type: 'Enterprise',
                        ParentOrganizationNumber: null,
                        OrganizationNumber: '118345674',
                        OrganizationForm: 'FLI',
                        Status: 'Active',
                    },
                    antallSykmeldte: 4,
                },
            ],
            refusjoner: [
                {
                    virksomhetsnummer: '182345674',
                    statusoversikt: {
                        KLAR_FOR_INNSENDING: 3,
                        FOR_TIDLIG: 1,
                    },
                    tilgang: true,
                },
            ],
        })
    ),
    http.get(/.*arbeidsgiver-arbeidsforhold-api\/antall-arbeidsforhold.*/, () => {
        console.log('request mottatt for arbeidsforhold!!!');
        return HttpResponse.json({
            second: 53,
        });
    }),
    http.get(/.*presenterte-kandidater-api\/ekstern\/antallkandidater.*/, () =>
        HttpResponse.json({
            antallKandidater: 85,
        })
    ),
    http.get(/.*stillingsregistrering-api\/api\/stillinger\/numberByStatus.*/, () => {
        console.log('stillingsregistrering-api/api/stillinger/numberByStatus ETT ELLER ANNET');
        return HttpResponse.json({ PUBLISERT: 20 });
    }),
    http.get(/.*tiltaksgjennomforing-api\/avtaler.*/, () =>
        HttpResponse.json([
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'VARIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'INKLUDERINGSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'INKLUDERINGSTILSKUDD',
            },
            {
                tiltakstype: 'MENTOR',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MENTOR',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'VARIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MENTOR',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'INKLUDERINGSTILSKUDD',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'VARIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'VARIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MENTOR',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
        ])
    ),
    http.get(/.*api\/sykefravaerstatistikk.*/, () =>
        HttpResponse.json({
            type: 'BRANSJE',
            label: 'Barnehager',
            prosent: 15.8,
        })
    )
);
