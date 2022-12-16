module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/api/refusjon_status', (req, res) => {
                res.send([
                    {
                        virksomhetsnummer: "999911111",
                        statusoversikt: {
                            "KLAR_FOR_INNSENDING": 3,
                            "FOR_TIDLIG": 1,
                        },
                        tilgang: true,
                    },
                    {
                        virksomhetsnummer: "910811111",
                        statusoversikt: {
                            "KLAR_FOR_INNSENDING": 1,
                            "FOR_TIDLIG": 2,
                        },
                        tilgang: true,
                    },
                    {
                        virksomhetsnummer: "811011111",
                        statusoversikt: {
                            "FOR_TIDLIG": 2,
                        },
                        tilgang: true,
                    },
                ])
            }
        );
    }
}
