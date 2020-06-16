import fetchMock from 'fetch-mock';

fetchMock
    .get(
        'begin:https://data.brreg.no/enhetsregisteret/api/underenheter',

        {
            "organisasjonsnummer": "974491850",
            "navn": "HANNAS BALLETTSTUDIO",
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
                "beskrivelse": "Undervisning i kunstfag",
                "kode": "85.522"
            },
            "antallAnsatte": 0,
            "overordnetEnhet": "982033268",
            "oppstartsdato": "1995-03-01",
            "datoEierskifte": "2000-07-01",
            "beliggenhetsadresse": {
                "land": "Norge",
                "landkode": "NO",
                "postnummer": "8014",
                "poststed": "BODØ",
                "adresse": [
                    "Storgata 46"
                ],
                "kommune": "BODØ",
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
        "navn": "SVANEN Hanna Bertine Olea Kanck",
        "organisasjonsform": {
            "kode": "ENK",
            "beskrivelse": "Enkeltpersonforetak",
            "_links": {
                "self": {
                    "href": "https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/ENK"
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
        "registreringsdatoEnhetsregisteret": "2000-06-02",
        "registrertIMvaregisteret": false,
        "naeringskode1": {
            "beskrivelse": "Undervisning i kunstfag",
            "kode": "85.522"
        },
        "antallAnsatte": 0,
        "forretningsadresse": {
            "land": "Norge",
            "landkode": "NO",
            "postnummer": "8011",
            "poststed": "BODØ",
            "adresse": [
                "Stormyra"
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