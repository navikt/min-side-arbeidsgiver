import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

export const OrganisasjonerResponse = [
    {
        Name: 'Andeby kommune',
        ParentOrganizationNumber: null,
        OrganizationNumber: '112233445',
        OrganizationForm: 'KOMM',
    },
    {
        Name: 'Andeby Mellomorganisasjon',
        ParentOrganizationNumber: '112233445',
        OrganizationNumber: '112233345',
        OrganizationForm: 'ORGL',
    },
    {
        Name: 'Andeby barnehagestyrer',
        ParentOrganizationNumber: '112233345',
        OrganizationNumber: '112223345',
        OrganizationForm: 'ORGL',
    },
    {
        Name: 'Andeby barnehage',
        ParentOrganizationNumber: '112223345',
        OrganizationNumber: '111223345',
        OrganizationForm: 'BEDR',
    },
    {
        Name: 'En Juridisk Ehhet AS',
        ParentOrganizationNumber: null,
        OrganizationNumber: '812345674',
        OrganizationForm: 'AS',
    },
    {
        Name: 'BALLSTAD OG HAMARØY',
        OrganizationNumber: '182345674',
        ParentOrganizationNumber: '118345674',
        OrganizationForm: 'AAFY',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        ParentOrganizationNumber: null,
        OrganizationNumber: '118345674',
        OrganizationForm: 'FLI',
    },
    {
        Name: 'TEST AV AAFY ',
        OrganizationNumber: '119845674',
        ParentOrganizationNumber: '118985674',
        OrganizationForm: 'AAFY',
    },
    {
        Name: 'NAV ENGERDAL',
        ParentOrganizationNumber: '812345674',
        OrganizationNumber: '119985432',
        OrganizationForm: 'BEDR',
    },
    {
        Name: 'NAV HAMAR',
        ParentOrganizationNumber: '812345674',
        OrganizationNumber: '119988432',
        OrganizationForm: 'BEDR',
    },
    {
        Name: 'BJØRNØYA OG ROVDE REVISJON',
        ParentOrganizationNumber: null,
        OrganizationNumber: '123988321',
        OrganizationForm: 'AS',
    },
    {
        Name: 'ARENDAL OG BØNES REVISJON',
        ParentOrganizationNumber: '123988321',
        OrganizationNumber: '321988123',
        OrganizationForm: 'BEDR',
    },
    {
        Name: 'GRAVDAL OG SOLLIA REVISJON',
        ParentOrganizationNumber: '123988321',
        OrganizationNumber: '311288223',
        OrganizationForm: 'BEDR',
    },
    {
        Name: 'STORFOSNA OG FREDRIKSTAD REGNSKAP',
        ParentOrganizationNumber: '311388333',
        OrganizationNumber: '411488444',
        OrganizationForm: 'AAFY',
    },
    {
        Name: 'TRANØY OG SANDE I VESTFOLD REGNSKAP',
        ParentOrganizationNumber: null,
        OrganizationNumber: '311388333',
        OrganizationForm: 'FLI',
    },
    {
        Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
        OrganizationNumber: '121488424',
        OrganizationForm: 'AS',
    },
    {
        Name: 'SALTRØD OG HØNEBY',
        OrganizationNumber: '999999999',
        ParentOrganizationNumber: '121488424',
        OrganizationForm: 'BEDR',
    },
];
const mockOrgnr = () => faker.number.int({ min: 100000000, max: 999999999 }).toString();

const mockUnderenhet = (parentOrganizationNumber: string) => ({
    Name: faker.company.name(),
    OrganizationNumber: mockOrgnr(),
    ParentOrganizationNumber: parentOrganizationNumber,
    OrganizationForm: 'BEDR',
});

const mockHovedenhet = (organizationNumber: string) => ({
    Name: faker.company.name(),
    ParentOrganizationNumber: null,
    OrganizationNumber: organizationNumber,
    OrganizationForm: 'AS',
});

const generateUnderenheter = () => {
    const orgnummer = mockOrgnr();
    const underenheter = Array(faker.number.int({ min: 1, max: 11 }))
        .fill(null)
        .map(() => mockUnderenhet(orgnummer));
    const hovedenhet = mockHovedenhet(orgnummer);
    return [hovedenhet, ...underenheter];
};

const andreOrganisasjoner = Array(40)
    .fill(null)
    .flatMap(() => {
        return generateUnderenheter();
    });

const organisasjonerMedRettigheter = [
    '182345674',
    '118345674',
    '822565212',
    '922658986',
    '121488424',
    '999999999',
];

const formLøsOrganisasjon = {
    Name: 'SALTRØD OG HØNEBY',
    OrganizationNumber: '999999999',
    ParentOrganizationNumber: '121488424',
    OrganizationForm: null,
};

const alleTjenester = [
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
];

export const userInfoHandler = http.get('/min-side-arbeidsgiver/api/userInfo/v1', () =>
    HttpResponse.json({
        altinnError: false,
        organisasjoner: [...OrganisasjonerResponse, ...andreOrganisasjoner, formLøsOrganisasjon],
        tilganger: [
            {
                id: 'mentortilskudd',
                tjenestekode: '5216',
                tjenesteversjon: '1',
                organisasjoner: ['182345674', '118345674', '119985432', '119988432'],
            },
            {
                id: 'inntektsmelding',
                tjenestekode: '4936',
                tjenesteversjon: '1',
                organisasjoner: ['182345674', '118345674', '999999999', '121488424'],
            },
            ...alleTjenester
                .filter(({ id }) => id !== 'mentortilskudd' && id !== 'inntektsmelding')
                .map((tjeneste) => ({
                    ...tjeneste,
                    organisasjoner: OrganisasjonerResponse.map(
                        ({ OrganizationNumber }) => OrganizationNumber
                    ).filter((orgnr) => organisasjonerMedRettigheter.includes(orgnr)),
                })),
        ],
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
);
