import fetchMock from 'fetch-mock';

fetchMock
    .get(
        'begin:/https://data.brreg.no/enhetsregisteret/api/underenheter/',

        {
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
                kommune: 'Molde',
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
        }
    )
    .spy();

fetchMock
    .get('begin:/https://data.brreg.no/enhetsregisteret/api/enheter/', {
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
            kommune: 'Molde',
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
    })
    .spy();
