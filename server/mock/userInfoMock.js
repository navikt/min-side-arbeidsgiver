import casual from 'casual';

export const OrganisasjonerResponse = [
    {
        Name: 'En Juridisk Ehhet AS',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '812345674',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
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
    {
        Name: 'TEST AV AAFY ',
        Type: 'Business',
        OrganizationNumber: '119845674',
        ParentOrganizationNumber: '118985674',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'NAV ENGERDAL',
        Type: 'Business',
        ParentOrganizationNumber: '812345674',
        OrganizationNumber: '119985432',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV HAMAR',
        Type: 'Business',
        ParentOrganizationNumber: '812345674',
        OrganizationNumber: '119988432',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BJØRNØYA OG ROVDE REVISJON',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '123988321',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'ARENDAL OG BØNES REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: '123988321',
        OrganizationNumber: '321988123',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'GRAVDAL OG SOLLIA REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: '123988321',
        OrganizationNumber: '311288223',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'STORFOSNA OG FREDRIKSTAD REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '311388333',
        OrganizationNumber: '411488444',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'TRANØY OG SANDE I VESTFOLD REGNSKAP',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '311388333',
        OrganizationForm: 'FLI',
        Status: 'Active',
    },
    {
        Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
        Type: 'Enterprise',
        OrganizationNumber: '121488424',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'SALTRØD OG HØNEBY',
        Type: 'Business',
        OrganizationNumber: '999999999',
        ParentOrganizationNumber: '121488424',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
];
casual.define('orgnr', () => casual.integer(100000000, 999999999).toString());

casual.define('underenhet', (parentOrganizationNumber) => ({
    Name: casual.company_name,
    Type: 'Business',
    OrganizationNumber: casual.orgnr,
    ParentOrganizationNumber: parentOrganizationNumber,
    OrganizationForm: 'BEDR',
    Status: 'Active',
}));

casual.define('hovedenhet', (organizationNumber) => ({
    Name: casual.company_name,
    Type: 'Enterprise',
    ParentOrganizationNumber: null,
    OrganizationNumber: organizationNumber,
    OrganizationForm: 'AS',
    Status: 'Active',
}));

const generateUnderenheter = () => {
    const orgnummer = casual.orgnr;
    const underenheter = Array(casual.integer(1, 11))
        .fill(null)
        .map(() => casual.underenhet(orgnummer));
    const hovedenhet = casual.hovedenhet(orgnummer);
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

export const mock = (app) => {
    app.use('/min-side-arbeidsgiver/api/userInfo/v1', (req, res) => {
        if (Math.random() < 0.1) {
            res.sendStatus(502);
        } else {
            res.send({
                altinnError: casual.boolean,
                organisasjoner: [...OrganisasjonerResponse, ...andreOrganisasjoner],
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
                digisyfoError: casual.boolean,
                digisyfoOrganisasjoner: [
                    {
                        organisasjon: {
                            OrganizationNumber: '999999999',
                            Name: 'Saltrød og Høneby',
                            Type: 'Business',
                            ParentOrganizationNumber: '121488424',
                            OrganizationForm: 'BEDR',
                            Status: 'Active',
                        },
                        antallSykmeldte: 0,
                    },
                    {
                        organisasjon: {
                            OrganizationNumber: '121488424',
                            Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
                            Type: 'Enterprise',
                            ParentOrganizationNumber: null,
                            OrganizationForm: 'AS',
                            Status: 'Active',
                        },
                        antallSykmeldte: 0,
                    },
                    {
                        organisasjon: {
                            Name: 'BALLSTAD OG HAMARØY',
                            OrganizationForm: 'AAFY',
                            OrganizationNumber: '182345674',
                            ParentOrganizationNumber: '118345674',
                            Status: 'Active',
                            Type: 'Business',
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
                        antallSykmeldte: 0,
                    },
                    {
                        organisasjon: {
                            Name: 'BareSyfo Virksomhet',
                            OrganizationForm: 'AAFY',
                            OrganizationNumber: '121212121',
                            ParentOrganizationNumber: '111111111',
                            Status: 'Active',
                            Type: 'Business',
                        },
                        antallSykmeldte: 4,
                    },
                    {
                        organisasjon: {
                            Name: 'BareSyfo Juridisk',
                            Type: 'Enterprise',
                            ParentOrganizationNumber: null,
                            OrganizationNumber: '111111111',
                            OrganizationForm: 'FLI',
                            Status: 'Active',
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
            });
        }
    });
};
