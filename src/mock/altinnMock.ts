import fetchMock from 'fetch-mock';

fetchMock
    .get('ditt-nav-arbeidsgiver/api/organisasjoner', [{"Name":"NAV ENGERDAL","Type":"Business","ParentOrganizationNumber":"874652202","OrganizationNumber":"991378642","OrganizationForm":"BEDR","Status":"Active"}])
    .spy();

fetchMock
    .get('express:/ditt-nav-arbeidsgiver/api/roller/:id', [
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
            RoleDescription:
                'Administration of access to client roles for accountants and auditors',
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
    ])
    .spy();
