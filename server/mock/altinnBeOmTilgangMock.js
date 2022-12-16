const søknader = [
    {
        orgnr: '810911111',
        status: 'Unopened',
        submitUrl: 'https://fake-altinn/send-inn-soknad/',
        serviceCode: '5278',
        serviceEdition: '1',
        cratedDateTime: '',
        lastChangedDateTime: '',
    },
    {
        orgnr: '810993502',
        status: 'Created',
        submitUrl: 'https://fake-altinn/send-inn-soknad/',
        serviceCode: '5332',
        serviceEdition: '1',
        cratedDateTime: '',
        lastChangedDateTime: '',
    },
    {
        orgnr: '810993502',
        status: 'Unopened',
        submitUrl: '/mock-altinn/skjema/',
        serviceCode: '5516',
        serviceEdition: '1',
        cratedDateTime: '',
        lastChangedDateTime: '',
    },
    {
        orgnr: '810993502',
        status: 'Unopened',
        submitUrl: '/mock-altinn/skjema/',
        serviceCode: '5216',
        serviceEdition: '1',
        cratedDateTime: '',
        lastChangedDateTime: '',
    }
]

module.exports = {
    mock: (app) => {
        app.use('/min-side-arbeidsgiver/api/altinn-tilgangssoknad', (req, res) => {
            res.send(søknader);
        });
    }
};