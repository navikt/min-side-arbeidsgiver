module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/underenheter/:orgnr',
            (req, res) => {
                res.send({
                    "organisasjonsnummer": "973611111",
                    "navn": "Upopulær Dyreflokk",
                    "organisasjonsform": {
                        "kode": "BEDR",
                        "beskrivelse": "Bedrift",
                        "_links": {
                            "self": {
                                "href": "/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/organisasjonsformer/BEDR"
                            }
                        }
                    },
                    "postadresse": {
                        "land": "Norge",
                        "landkode": "NO",
                        "postnummer": "1358",
                        "poststed": "JAR",
                        "adresse": [
                            "Ringstabekkveien 58"
                        ],
                        "kommune": "BÆRUM",
                        "kommunenummer": "3024"
                    },
                    "registreringsdatoEnhetsregisteret": "2010-12-15",
                    "registrertIMvaregisteret": false,
                    "naeringskode1": {
                        "beskrivelse": "Administrasjon av finansmarkeder",
                        "kode": "66.110"
                    },
                    "antallAnsatte": 42,
                    "overordnetEnhet": "818711111",
                    "oppstartsdato": "2010-12-15",
                    "datoEierskifte": "2010-12-15",
                    "beliggenhetsadresse": {
                        "land": "Norge",
                        "landkode": "NO",
                        "postnummer": "7950",
                        "poststed": "ABELVÆR",
                        "adresse": [
                            "Abelværvegen 1175"
                        ],
                        "kommune": "NÆRØYSUND",
                        "kommunenummer": "5060"
                    },
                    "_links": {
                        "self": {
                            "href": "/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/underenheter/883811111"
                        },
                        "overordnetEnhet": {
                            "href": "/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/818711111"
                        }
                    }
                });
            });

        app.use(
            '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/:orgnr',
            (req, res) => {
                res.send({
                    "organisasjonsnummer": "818711111",
                    "navn": "Presentabel Bygning",
                    "organisasjonsform": {
                        "kode": "AS",
                        "beskrivelse": "Aksjeselskap",
                        "_links": {
                            "self": {
                                "href": "/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/organisasjonsformer/AS"
                            }
                        }
                    },
                    "hjemmeside": "foo.bar.baz",
                    "postadresse": {
                        "land": "Norge",
                        "landkode": "NO",
                        "postnummer": "2652",
                        "poststed": "SVINGVOLL",
                        "adresse": [
                            "Sørskei-Tjernet 7"
                        ],
                        "kommune": "GAUSDAL",
                        "kommunenummer": "3441"
                    },
                    "registreringsdatoEnhetsregisteret": "2004-12-15",
                    "registrertIMvaregisteret": false,
                    "naeringskode1": {
                        "beskrivelse": "Administrasjon av finansmarkeder",
                        "kode": "66.110"
                    },
                    "antallAnsatte": 0,
                    "forretningsadresse": {
                        "land": "Norge",
                        "landkode": "NO",
                        "postnummer": "7950",
                        "poststed": "ABELVÆR",
                        "adresse": [
                            "Niels Brandtzægs veg 22"
                        ],
                        "kommune": "NÆRØYSUND",
                        "kommunenummer": "5060"
                    },
                    "institusjonellSektorkode": {
                        "kode": "3200",
                        "beskrivelse": "Banker"
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
                            "href": "/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/818711111"
                        }
                    }
                });
            });
    }
};