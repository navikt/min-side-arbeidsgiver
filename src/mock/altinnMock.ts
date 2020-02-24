import fetchMock from 'fetch-mock';
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        'min-side-arbeidsgiver/api/organisasjoner',
        delay.then(() => {
            return OrganisasjonerResponse;
        })
    )
    .spy();

const OrganisasjonerResponse = [
    {
        Name: 'STORFOSNA OG FREDRIKSTAD REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '910825550',
        OrganizationNumber: '910825569',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'ULNES OG SÆBØ',
        Type: 'Business',
        ParentOrganizationNumber: '910712217',
        OrganizationNumber: '910712241',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'TRANØY OG SANDE I VESTFOLD REGNSKAP',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '910825550',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'BYGSTAD OG VINTERBRO REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '910825321',
        OrganizationNumber: '910825348',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'LINESØYA OG LANGANGEN REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '910825550',
        OrganizationNumber: '910825585',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'SLEMMESTAD OG STAVERN REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '810825472',
        OrganizationNumber: '910825496',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'ENEBAKK OG SANDSHAMN REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: null,
        OrganizationNumber: '911000474',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'STØ OG BERGER',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '910712217',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'UTVIK OG ETNE',
        Type: 'Business',
        ParentOrganizationNumber: '910712217',
        OrganizationNumber: '910712233',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'LALM OG NARVIK REVISJON',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '911003155',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'MALMEFJORDEN OG RIDABU REGNSKAP',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '810825472',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'ENEBAKK OG ØYER',
        Type: 'Business',
        ParentOrganizationNumber: '910712217',
        OrganizationNumber: '910712268',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BIRTAVARRE OG VÆRLANDET REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '910825550',
        OrganizationNumber: '910825607',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'MAURA OG KOLBU REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '810825472',
        OrganizationNumber: '910825518',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'GAMLE FREDRIKSTAD OG RAMNES REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '810825472',
        OrganizationNumber: '910825526',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
];

fetchMock
    .get(
        '/min-side-arbeidsgiver/api/rettigheter-til-skjema/?serviceKode=5216&serviceEdition=1',
        delay.then(() => {
            return mentortilskuddskjemaResponse;
        })
    )
    .spy();
fetchMock
    .get(
        'begin:/min-side-arbeidsgiver/api/rettigheter-til-skjema/',
        delay.then(() => {
            return ekspertBistandSkjemaResponse;
        })
    )
    .spy();

const ekspertBistandSkjemaResponse = [
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
];
const mentortilskuddskjemaResponse = [
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
    },
];

fetchMock
    .get(
        'express:/min-side-arbeidsgiver/api/roller/:id',
        delay.then(() => {
            return rollerResponse;
        })
    )
    .spy();

const rollerResponse = [
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 4,
        RoleName: 'Access manager',
        RoleDescription: 'Administration of access',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 6,
        RoleName: 'Accounting employee',
        RoleDescription: 'Access to accounting related forms and services',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 85,
        RoleName: 'Auditor certifies validity of VAT compensation',
        RoleDescription: 'Certification by auditor of RF-0009',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 15,
        RoleName: 'Client administrator',
        RoleDescription: 'Administration of access to client roles for accountants and auditors',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 3380,
        RoleName: 'ECKEYROLE',
        RoleDescription: 'Nøkkelrolle for virksomhetsertifikatbrukere',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 12,
        RoleName: 'Energy, environment and climate',
        RoleDescription: 'Access to services related to energy, environment and climate',
    },
    {
        RoleId: 226780,
        RoleType: 'External',
        RoleDefinitionId: 195,
        RoleName: 'General manager',
        RoleDescription:
            'External role (from The Central Coordinating Register for Legal Entities)',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 131,
        RoleName: 'Health-, social- and welfare services',
        RoleDescription: 'Access to health-, social- and welfare related services',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 8,
        RoleName: 'Limited signing rights',
        RoleDescription: 'Signing access for selected forms and services',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 5603,
        RoleName: 'Mail/archive',
        RoleDescription: 'Access to read correpondences',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 134,
        RoleName: 'Municipal services',
        RoleDescription: 'Role for municipal services',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 5576,
        RoleName: 'Parallel signing',
        RoleDescription: 'Right to sign elements from other reportees',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 87,
        RoleName: 'Patents, trademarks and design',
        RoleDescription: 'Access to services related to patents, trademarks and design',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 24448,
        RoleName: 'Plan- og byggesak',
        RoleDescription:
            'Rollen er forbeholdt skjemaer og tjenester som er godkjent av Direktoratet for byggkvalitet (DiBK).',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 272,
        RoleName: 'Primary industry and foodstuff',
        RoleDescription:
            'Import, processing, production and/or sales of primary products and other foodstuff',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 11,
        RoleName: 'Reporter/sender',
        RoleDescription: 'Access to selected forms and services',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 3,
        RoleName: 'Salaries and personnel employee',
        RoleDescription: 'Access to services related to salaries and personnel',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 130,
        RoleName: 'Signer of Coordinated register notification',
        RoleDescription: 'Applies to singing on behalf of entities/businesses',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 10,
        RoleName: 'Transport',
        RoleDescription: 'Access to services related to transport',
    },
    {
        RoleType: 'Altinn',
        RoleDefinitionId: 86,
        RoleName: 'Økokrim reporting',
        RoleDescription:
            'Access to services from The Norwegian National Authority for Investigation and Prosecution of Economic and Environmental Crime',
    },
];
