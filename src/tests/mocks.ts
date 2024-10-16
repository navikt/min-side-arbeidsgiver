import { setupServer } from 'msw/node';
import { graphql, http, HttpResponse } from 'msw';
import { orgnr } from '../mocks/faker/brukerApiHelpers';
import { faker } from '@faker-js/faker';

export const server = setupServer(
    http.get(`${__BASE_PATH__}/api/userInfo/v2`, () =>
        HttpResponse.json({
            altinnError: false,
            organisasjoner: [
                {
                    orgNr: orgnr(),
                    underenheter: [
                        {
                            orgNr: '182345674',
                            underenheter: [],
                            name: faker.company.name(),
                            organizationForm: 'BEDR',
                        },
                        {
                            orgNr: '118345674',
                            underenheter: [],
                            name: faker.company.name(),
                            organizationForm: 'BEDR',
                        },
                        {
                            orgNr: '119985432',
                            underenheter: [],
                            name: faker.company.name(),
                            organizationForm: 'BEDR',
                        },
                        {
                            orgNr: '119988432',
                            underenheter: [],
                            name: faker.company.name(),
                            organizationForm: 'BEDR',
                        },
                    ],
                    name: faker.company.name(),
                    organizationForm: 'AS',
                },
            ],
            tilganger: {
                '5384:1': ['182345674', '118345674', '119985432', '119988432'],
                '4936:1': ['182345674', '118345674', '119985432', '119988432'],
                '4826:1': ['182345674', '118345674', '119985432', '119988432'],
                '5332:1': ['182345674', '118345674', '119985432', '119988432'],
                '5441:1': ['182345674', '118345674', '119985432', '119988432'],
                '5516:1': ['182345674', '118345674', '119985432', '119988432'],
                '5516:2': ['182345674', '118345674', '119985432', '119988432'],
                '5516:3': ['182345674', '118345674', '119985432', '119988432'],
                '5516:4': ['182345674', '118345674', '119985432', '119988432'],
                '5516:5': ['182345674', '118345674', '119985432', '119988432'],
                '3403:1': ['182345674', '118345674', '119985432', '119988432'],
                '5934:1': ['182345674', '118345674', '119985432', '119988432'],
                '5078:1': ['182345674', '118345674', '119985432', '119988432'],
                '5278:1': ['182345674', '118345674', '119985432', '119988432'],
                '5902:1': ['182345674', '118345674', '119985432', '119988432'],
            },
            digisyfoError: false,
            digisyfoOrganisasjoner: [
                {
                    organisasjon: {
                        OrganizationNumber: '999999999',
                        Name: 'Saltrød og Høneby',
                        ParentOrganizationNumber: '121488424',
                        OrganizationForm: 'BEDR',
                    },
                    antallSykmeldte: 0,
                },
                {
                    organisasjon: {
                        OrganizationNumber: '121488424',
                        Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
                        ParentOrganizationNumber: null,
                        OrganizationForm: 'AS',
                    },
                    antallSykmeldte: 0,
                },
                {
                    organisasjon: {
                        Name: 'BALLSTAD OG HAMARØY',
                        OrganizationForm: 'AAFY',
                        OrganizationNumber: '182345674',
                        ParentOrganizationNumber: '118345674',
                    },
                    antallSykmeldte: 4,
                },
                {
                    organisasjon: {
                        Name: 'BALLSTAD OG HORTEN',
                        ParentOrganizationNumber: null,
                        OrganizationNumber: '118345674',
                        OrganizationForm: 'FLI',
                    },
                    antallSykmeldte: 0,
                },
                {
                    organisasjon: {
                        Name: 'BareSyfo Virksomhet',
                        OrganizationForm: 'AAFY',
                        OrganizationNumber: '121212121',
                        ParentOrganizationNumber: '111111111',
                    },
                    antallSykmeldte: 4,
                },
                {
                    organisasjon: {
                        Name: 'BareSyfo Juridisk',
                        ParentOrganizationNumber: null,
                        OrganizationNumber: '111111111',
                        OrganizationForm: 'FLI',
                    },
                    antallSykmeldte: 4,
                },
            ],
            refusjoner: [
                {
                    virksomhetsnummer: '999999999',
                    statusoversikt: {
                        KLAR_FOR_INNSENDING: 3,
                        FOR_TIDLIG: 1,
                    },
                    tilgang: true,
                },
                {
                    virksomhetsnummer: '121488424',
                    statusoversikt: {
                        KLAR_FOR_INNSENDING: 1,
                        FOR_TIDLIG: 2,
                    },
                    tilgang: true,
                },
                {
                    virksomhetsnummer: '182345674',
                    statusoversikt: {
                        FOR_TIDLIG: 2,
                    },
                    tilgang: true,
                },
            ],
        })
    ),
    http.get(`${__BASE_PATH__}/api/userInfo/v1`, () =>
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
    http.post(`${__BASE_PATH__}/api/varslingStatus/v1`, () =>
        HttpResponse.json({
            status: 'OK',
            varselTimestamp: '2021-01-01T00:00:00',
            kvittertEventTimestamp: '2021-01-04T00:00:00Z',
        })
    ),
    http.get(/.*arbeidsgiver-arbeidsforhold-api\/antall-arbeidsforhold.*/, () =>
        HttpResponse.json({
            second: 53,
        })
    ),
    http.get(/.*presenterte-kandidater-api\/ekstern\/antallkandidater.*/, () =>
        HttpResponse.json({
            antallKandidater: 85,
        })
    ),
    http.get(`${__BASE_PATH__}/stillingsregistrering-api/api/stillinger/numberByStatus`, () =>
        HttpResponse.json({ PUBLISERT: 20 })
    ),
    http.post(`${__BASE_PATH__}/stillingsregistrering-api/api/arbeidsgiver/:orgnr`, () =>
        HttpResponse.json({})
    ),
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
    ),
    http.get(
        `${__BASE_PATH__}/mock/data.brreg.no/enhetsregisteret/api/underenheter/:orgnr`,
        ({ params }) =>
            HttpResponse.json({
                organisasjonsnummer: params.orgnr,
                navn: 'Upopulær Dyreflokk',
                organisasjonsform: {
                    kode: 'BEDR',
                    beskrivelse: 'Bedrift',
                    _links: {
                        self: {
                            href: '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/organisasjonsformer/BEDR',
                        },
                    },
                },
                postadresse: {
                    land: 'Norge',
                    landkode: 'NO',
                    postnummer: '1358',
                    poststed: 'JAR',
                    adresse: ['Ringstabekkveien 58'],
                    kommune: 'BÆRUM',
                    kommunenummer: '3024',
                },
                registreringsdatoEnhetsregisteret: '2010-12-15',
                registrertIMvaregisteret: false,
                naeringskode1: {
                    beskrivelse: 'Administrasjon av finansmarkeder',
                    kode: '66.110',
                },
                antallAnsatte: 42,
                overordnetEnhet: '818711111',
                oppstartsdato: '2010-12-15',
                datoEierskifte: '2010-12-15',
                beliggenhetsadresse: {
                    land: 'Norge',
                    landkode: 'NO',
                    postnummer: '7950',
                    poststed: 'ABELVÆR',
                    adresse: ['Abelværvegen 1175'],
                    kommune: 'NÆRØYSUND',
                    kommunenummer: '5060',
                },
                _links: {
                    self: {
                        href: '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/underenheter/151488454',
                    },
                    overordnetEnhet: {
                        href: '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/181488484',
                    },
                },
            })
    ),
    http.get(`${__BASE_PATH__}/api/altinn-tilgangssoknad`, () =>
        HttpResponse.json([
            {
                orgnr: '321988123',
                status: 'Unopened',
                submitUrl: 'https://fake-altinn/send-inn-soknad/',
                serviceCode: '5278',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
            {
                orgnr: '321988123',
                status: 'Created',
                submitUrl: 'https://fake-altinn/send-inn-soknad/',
                serviceCode: '5332',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
        ])
    ),
    graphql.query('hentSaker', () => {
        return HttpResponse.json({
            data: {
                saker: {
                    saker: [
                        {
                            id: '525a419e-56c9-4194-bb92-2a406a826243',
                            tittel: 'Permitteringsmelding 14 ansatte TEST',
                            lenke: '#',
                            virksomhet: {
                                navn: 'Gamle Fredikstad og Riksdalen regnskap',
                                virksomhetsnummer:
                                    'tempore commodi corrupti aut asperiores ut perferendis',
                                __typename: 'Virksomhet',
                            },
                            sisteStatus: {
                                type: 'UNDER_BEHANDLING',
                                tekst: 'Under behandling',
                                tidspunkt: '2024-01-06T11:45:25.073Z',
                                __typename: 'SakStatus',
                            },
                            tidslinje: [
                                {
                                    __typename: 'OppgaveTidslinjeElement',
                                    id: '0.ju5z2d82kyc',
                                    tekst: 'Avtalen må godkjennes på nytt.',
                                    tilstand: 'NY',
                                    frist: '2023-12-30T12:05:25.073Z',
                                    opprettetTidspunkt: '2023-12-28T12:27:25.073Z',
                                    paaminnelseTidspunkt: null,
                                    utfoertTidspunkt: null,
                                    utgaattTidspunkt: null,
                                },
                                {
                                    __typename: 'BeskjedTidslinjeElement',
                                    id: '0.y7egbm5yzg',
                                    tekst: 'Avtale om arbeidstiltak godkjent.',
                                    opprettetTidspunkt: '2024-01-13T07:27:25.073Z',
                                },
                            ],
                            __typename: 'Sak',
                        },
                        {
                            id: '61ddfc9f-dd0d-4eb3-973e-f53dd7557007',
                            tittel: 'Søknad om fritak fra arbeidsgiverperioden – gravid ansatt Glovarm Bagasje',
                            lenke: '#',
                            virksomhet: {
                                navn: 'Gamle Fredikstad og Riksdalen regnskap',
                                virksomhetsnummer:
                                    'tempore reprehenderit blanditiis inventore at nihil architecto',
                                __typename: 'Virksomhet',
                            },
                            sisteStatus: {
                                type: 'UNDER_BEHANDLING',
                                tekst: 'Mottatt',
                                tidspunkt: '2023-11-14T12:06:25.073Z',
                                __typename: 'SakStatus',
                            },
                            tidslinje: [
                                {
                                    __typename: 'BeskjedTidslinjeElement',
                                    id: '0.ymz4g2gw8yn',
                                    tekst: 'Avtalen må godkjennes på nytt.',
                                    opprettetTidspunkt: '2024-01-02T12:27:25.073Z',
                                },
                                {
                                    __typename: 'OppgaveTidslinjeElement',
                                    id: '0.8ccy3cavfio',
                                    tekst: 'Avtalen må godkjennes på nytt.',
                                    tilstand: 'UTFOERT',
                                    frist: '2024-01-12T12:26:25.073Z',
                                    opprettetTidspunkt: '2023-12-17T12:06:25.073Z',
                                    paaminnelseTidspunkt: '2023-12-19T19:27:25.073Z',
                                    utfoertTidspunkt: '2023-07-27T10:03:15.426Z',
                                    utgaattTidspunkt: null,
                                },
                            ],
                            __typename: 'Sak',
                        },
                        {
                            id: '1af36b5b-5630-406e-b989-6b08047e3530',
                            tittel: 'Varsel om permittering 12 ansatte TEST',
                            lenke: '#',
                            virksomhet: {
                                navn: 'Gamle Fredikstad og Riksdalen regnskap',
                                virksomhetsnummer: 'porro qui voluptatem qui magni aut id',
                                __typename: 'Virksomhet',
                            },
                            sisteStatus: {
                                type: 'UNDER_BEHANDLING',
                                tekst: 'Under behandling',
                                tidspunkt: '2024-01-03T12:34:25.073Z',
                                __typename: 'SakStatus',
                            },
                            tidslinje: [
                                {
                                    __typename: 'BeskjedTidslinjeElement',
                                    id: '0.x8wuv8runs',
                                    tekst: 'Du kan nå søke om refusjon.',
                                    opprettetTidspunkt: '2024-01-14T19:06:25.073Z',
                                },
                                {
                                    __typename: 'OppgaveTidslinjeElement',
                                    id: '0.diy6gwrzlfk',
                                    tekst: 'Mål i avtale endret av veileder.',
                                    tilstand: 'UTFOERT',
                                    frist: null,
                                    opprettetTidspunkt: '2023-12-20T12:11:25.073Z',
                                    paaminnelseTidspunkt: '2023-12-16T00:33:25.073Z',
                                    utfoertTidspunkt: '2023-10-12T02:08:06.941Z',
                                    utgaattTidspunkt: null,
                                },
                            ],
                            __typename: 'Sak',
                        },
                    ],
                    sakstyper: [
                        {
                            navn: 'Lønnstilskudd',
                            antall: 4,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Mentor',
                            antall: 1,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Sommerjobb',
                            antall: 2,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Arbeidstrening',
                            antall: 7,
                            __typename: 'Sakstype',
                        },
                    ],
                    feilAltinn: true,
                    totaltAntallSaker: 314,
                    oppgaveTilstandInfo: [
                        {
                            tilstand: 'UTFOERT',
                            antall: 621,
                            __typename: 'OppgaveTilstandInfo',
                        },
                        {
                            tilstand: 'NY',
                            antall: 877,
                            __typename: 'OppgaveTilstandInfo',
                        },
                    ],
                    __typename: 'SakerResultat',
                },
            },
        });
    })
);
