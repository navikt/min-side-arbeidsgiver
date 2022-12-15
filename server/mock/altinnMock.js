const OrganisasjonerResponse = [
    {
        Name: 'En Juridisk Ehhet AS',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '874611111',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811011111',
        ParentOrganizationNumber: '811011111',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '811011111',
        OrganizationForm: 'FLI',
        Status: 'Active',
    },
    {
        Name: 'TEST AV AAFY ',
        Type: 'Business',
        OrganizationNumber: '973611111',
        ParentOrganizationNumber: '971311111',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'NAV ENGERDAL',
        Type: 'Business',
        ParentOrganizationNumber: '874611111',
        OrganizationNumber: '991311111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV HAMAR',
        Type: 'Business',
        ParentOrganizationNumber: '874611111',
        OrganizationNumber: '990211111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BJØRNØYA OG ROVDE REVISJON',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '810911111',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'ARENDAL OG BØNES REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: '810911111',
        OrganizationNumber: '810911111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'GRAVDAL OG SOLLIA REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: '810911111',
        OrganizationNumber: '910911111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'STORFOSNA OG FREDRIKSTAD REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '910811111',
        OrganizationNumber: '910811111',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'TRANØY OG SANDE I VESTFOLD REGNSKAP',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910811111',
        OrganizationForm: 'FLI',
        Status: 'Active',
    },
    {
        Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
        Type: 'Enterprise',
        OrganizationNumber: '910811111',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'SALTRØD OG HØNEBY',
        Type: 'Business',
        OrganizationNumber: '999911111',
        ParentOrganizationNumber: '910811111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    }
];

const organisasjonerMedRettigheter = [
    '811011111',
    '811011111',
    '822511111',
    '922611111',
    '910811111',
    '999911111',
];
const rettigheterSkjemaDefaultResponse = OrganisasjonerResponse
    .filter(({OrganizationNumber}) => organisasjonerMedRettigheter.includes(OrganizationNumber));

const mentortilskuddskjemaResponse = [
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811011111',
        ParentOrganizationNumber: '811011111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        OrganizationNumber: '811011111',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'NAV ENGERDAL',
        Type: 'Business',
        ParentOrganizationNumber: '874611111',
        OrganizationNumber: '991311111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV HAMAR',
        Type: 'Business',
        ParentOrganizationNumber: '874611111',
        OrganizationNumber: '990211111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    }
];

const InntektsmeldingSkjemaResponse = [
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811011111',
        ParentOrganizationNumber: '811011111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        OrganizationNumber: '811011111',
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