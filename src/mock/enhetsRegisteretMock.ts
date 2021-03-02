import fetchMock from 'fetch-mock';

export const mock = () => {
    fetchMock
        .get(
            'begin:https://data.brreg.no/enhetsregisteret/api/underenheter',

            {
                "organisasjonsnummer": "974491850",
                "navn": "VIRKSOMHETENS NAVN",
                "organisasjonsform": {
                    "kode": "BEDR",
                    "beskrivelse": "Bedrift",
                    "_links": {
                        "self": {
                            "href": "https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/BEDR"
                        }
                    }
                },
                "postadresse": {
                    "land": "Norge",
                    "landkode": "NO",
                    "postnummer": "8003",
                    "poststed": "BODØ",
                    "adresse": [
                        "Evald Erlandsens vei 10"
                    ],
                    "kommune": "BODØ",
                    "kommunenummer": "1804"
                },
                "registreringsdatoEnhetsregisteret": "1995-06-15",
                "registrertIMvaregisteret": false,
                "naeringskode1": {
                    "beskrivelse": "Xyz",
                    "kode": "85.522"
                },
                "antallAnsatte": 0,
                "overordnetEnhet": "982033268",
                "oppstartsdato": "1995-03-01",
                "datoEierskifte": "2000-07-01",
                "beliggenhetsadresse": {
                    "land": "Norge",
                    "landkode": "NO",
                    "postnummer": "1234",
                    "poststed": "KARDEMOMME BY",
                    "adresse": [
                        "Tante Sofies gate 1"
                    ],
                    "kommune": "KRISTIANSAND",
                    "kommunenummer": "1804"
                },
                "_links": {
                    "self": {
                        "href": "https://data.brreg.no/enhetsregisteret/api/underenheter/974491850"
                    },
                    "overordnetEnhet": {
                        "href": "https://data.brreg.no/enhetsregisteret/api/enheter/982033268"
                    }
                }
            },
        )
        .spy();

    fetchMock
        .get('begin:https://data.brreg.no/enhetsregisteret/api/enheter', {
            "organisasjonsnummer": "982033268",
            "navn": "Navn på overordnet enhet",
            "organisasjonsform": {
                "kode": "ENK",
                "beskrivelse": "Enkeltpersonforetak",
                "_links": {
                    "self": {
                        "href": "https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/ENK"
                    }
                }
            },
            "hjemmeside": "www.hjemmeside123.no",
            "postadresse": {
                "land": "Norge",
                "landkode": "NO",
                "postnummer": "1234",
                "poststed": "KRISTIANSAND",
                "adresse": [
                    "Thorbjørn Egners vei 10"
                ],
                "kommune": "BODØ",
                "kommunenummer": "1804"
            },
            "registreringsdatoEnhetsregisteret": "2000-06-02",
            "registrertIMvaregisteret": false,
            "naeringskode1": {
                "beskrivelse": "Xyz",
                "kode": "85.522"
            },
            "antallAnsatte": 0,
            "forretningsadresse": {
                "land": "Norge",
                "landkode": "NO",
                "postnummer": "1324",
                "poststed": "KARDEMOMME BY",
                "adresse": [
                    "Røverhuset "
                ],
                "kommune": "BODØ",
                "kommunenummer": "1804"
            },
            "institusjonellSektorkode": {
                "kode": "8200",
                "beskrivelse": "Personlig næringsdrivende"
            },
            "registrertIForetaksregisteret": false,
            "registrertIStiftelsesregisteret": false,
            "registrertIFrivillighetsregisteret": false,
            "konkurs": false,
            "underAvvikling": false,
            "underTvangsavviklingEllerTvangsopplosning": false,
            "maalform": "Bokmål",
            "_links": {
                "self": {
                    "href": "https://data.brreg.no/enhetsregisteret/api/enheter/982033268"
                }
            }
        })
        .spy();
}