const søknader = [
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
    {
        orgnr: '321988123',
        status: 'Unopened',
        submitUrl: '/mock-altinn/skjema/',
        serviceCode: '5516',
        serviceEdition: 1,
        createdDateTime: '',
        lastChangedDateTime: '',
    },
    {
        orgnr: '321988123',
        status: 'Unopened',
        submitUrl: '/mock-altinn/skjema/',
        serviceCode: '5216',
        serviceEdition: 1,
        createdDateTime: '',
        lastChangedDateTime: '',
    },
];

export const mock = (app) => {
    app.use('/min-side-arbeidsgiver/api/altinn-tilgangssoknad', (req, res) => {
        res.send(søknader);
    });
};
