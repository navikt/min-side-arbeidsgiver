import fetchMock from 'fetch-mock';
const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        'begin:/https://data.brreg.no/enhetsregisteret/api/underenheter/',
        delay.then(() => {
            return {
                organisasjonsnummer: '66666666',
                navn: 'UnderEnhetsFraMock',
                organisasjonsform: {
                    kode: '',
                    beskrivelse: '',
                },
                overordnetEnhet: '77777777',
                antallAnsatte: '',
                hjemmeside: '',
                postadresse: {
                    land: '',
                    landkode: '',
                    postnummer: '',
                    poststed: '',
                    adresse: [''],
                    kommune: '',
                    kommunenummer: '',
                },
                forretningsadresse: {
                    land: '',
                    landkode: '',
                    postnummer: '',
                    poststed: '',
                    adresse: [''],
                    kommune: '',
                    kommunenummer: '',
                },
                naeringskode1: {
                    beskrivelse: '',
                    kode: '',
                },
                naeringskode2: {
                    beskrivelse: '',
                    kode: '',
                },
                naeringskode3: {
                    beskrivelse: '',
                    kode: '',
                },
            };
        })
    )
    .spy();

fetchMock
    .get(
        'begin:/https://data.brreg.no/enhetsregisteret/api/enheter/',
        delay.then(() => {
            return {
                organisasjonsnummer: '7777777',
                navn: 'EnhetFraMock',
                organisasjonsform: {
                    kode: '',
                    beskrivelse: '',
                },
                overordnetEnhet: '',
                antallAnsatte: '',
                hjemmeside: '',
                postadresse: {
                    land: '',
                    landkode: '',
                    postnummer: '',
                    poststed: '',
                    adresse: [''],
                    kommune: '',
                    kommunenummer: '',
                },
                forretningsadresse: {
                    land: '',
                    landkode: '',
                    postnummer: '',
                    poststed: '',
                    adresse: [''],
                    kommune: '',
                    kommunenummer: '',
                },
                naeringskode1: {
                    beskrivelse: '',
                    kode: '',
                },
                naeringskode2: {
                    beskrivelse: '',
                    kode: '',
                },
                naeringskode3: {
                    beskrivelse: '',
                    kode: '',
                },
            };
        })
    )
    .spy();
