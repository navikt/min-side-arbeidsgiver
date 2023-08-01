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
    }
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
    const underenheter =  Array(casual.integer(1, 11)).fill(null).map(() => casual.underenhet(orgnummer));
    const hovedenhet = casual.hovedenhet(orgnummer);
    return [hovedenhet, ...underenheter];
}

const andreOrganisasjoner = Array(40).fill(null).flatMap(() => {
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
const rettigheterSkjemaDefaultResponse = OrganisasjonerResponse
    .filter(({OrganizationNumber}) => organisasjonerMedRettigheter.includes(OrganizationNumber));

const mentortilskuddskjemaResponse = [
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '182345674',
        ParentOrganizationNumber: '118345674',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        OrganizationNumber: '118345674',
        OrganizationForm: 'AS',
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
    }
];


const InntektsmeldingSkjemaResponse = [
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '182345674',
        ParentOrganizationNumber: '118345674',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        OrganizationNumber: '118345674',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
];

export const mock = (app) => {
    app.use('/min-side-arbeidsgiver/api/organisasjoner', (req, res) => res.send([...OrganisasjonerResponse, ...andreOrganisasjoner]));
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