const OrganisasjonerResponse = [
    {
        Name: 'En Juridisk Ehhet AS',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '874652202',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811076732',
        ParentOrganizationNumber: '811076112',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '811076112',
        OrganizationForm: 'FLI',
        Status: 'Active',
    },
    {
        Name: 'DIGITAL JUNKIES AS ',
        Type: 'Business',
        OrganizationNumber: '922658986',
        ParentOrganizationNumber: '822565212',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'TEST AV AAFY ',
        Type: 'Business',
        OrganizationNumber: '973610015',
        ParentOrganizationNumber: '971348593',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'NAV ENGERDAL',
        Type: 'Business',
        ParentOrganizationNumber: '874652202',
        OrganizationNumber: '991378642',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV HAMAR',
        Type: 'Business',
        ParentOrganizationNumber: '874652202',
        OrganizationNumber: '990229023',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BJØRNØYA OG ROVDE REVISJON',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '810993472',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'ARENDAL OG BØNES REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: '810993472',
        OrganizationNumber: '810993502',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'GRAVDAL OG SOLLIA REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: '810993472',
        OrganizationNumber: '910993542',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'STORFOSNA OG FREDRIKSTAD REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '910825550',
        OrganizationNumber: '910825569',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'TRANØY OG SANDE I VESTFOLD REGNSKAP',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910825550',
        OrganizationForm: 'FLI',
        Status: 'Active',
    },
    {
        Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
        Type: 'Enterprise',
        OrganizationNumber: '910825555',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'SALTRØD OG HØNEBY',
        Type: 'Business',
        OrganizationNumber: '999999999',
        ParentOrganizationNumber: '910825555',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    }
];

const organisasjonerMedRettigheter = [
    '811076732',
    '811076112',
    '822565212',
    '922658986',
    '910825555',
    '999999999',
];
const rettigheterSkjemaDefaultResponse = OrganisasjonerResponse
    .filter(({OrganizationNumber}) => organisasjonerMedRettigheter.includes(OrganizationNumber));

const mentortilskuddskjemaResponse = [
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811076732',
        ParentOrganizationNumber: '811076112',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        OrganizationNumber: '811076112',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'DIGITAL JUNKIES AS ',
        Type: 'Enterprise',
        OrganizationNumber: '822565212',
        ParentOrganizationNumber: null,
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'DIGITAL JUNKIES AS ',
        Type: 'Business',
        OrganizationNumber: '922658986',
        ParentOrganizationNumber: '822565212',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV ENGERDAL',
        Type: 'Business',
        ParentOrganizationNumber: '874652202',
        OrganizationNumber: '991378642',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV HAMAR',
        Type: 'Business',
        ParentOrganizationNumber: '874652202',
        OrganizationNumber: '990229023',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    }
];

const InntektsmeldingSkjemaResponse = [
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811076732',
        ParentOrganizationNumber: '811076112',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        OrganizationNumber: '811076112',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
];

module.exports = {
    OrganisasjonerResponse,
    mock: (app) => {
        app.use('/min-side-arbeidsgiver/api/organisasjoner', (req, res) => res.send(OrganisasjonerResponse));
        app.use(
            '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=5216&serviceEdition=1',
            (req, res) => res.send(mentortilskuddskjemaResponse)
        );
        app.use(
            '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=4936&serviceEdition=1',
            (req, res) => res.send(InntektsmeldingSkjemaResponse)
        );
        app.use(
            '/min-side-arbeidsgiver/api/rettigheter-til-skjema/',
            (req, res) => res.send(rettigheterSkjemaDefaultResponse)
        );
    }
}