module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/api/narmesteleder/virksomheter-v2', (req, res) => {
                res.send([
                    {
                        organisasjon: {
                            OrganizationNumber: "999999999",
                            Name: "Saltrød og Høneby",
                            Type: "Business",
                            ParentOrganizationNumber: "910825555",
                            OrganizationForm: "BEDR",
                            Status: "Active",
                        },
                        antallSykmeldinger: 4,
                    },
                    {
                        organisasjon: {
                            OrganizationNumber: "910825555",
                            Name: "BIRTAVARRE OG VÆRLANDET FORELDER",
                            Type: "Enterprise",
                            ParentOrganizationNumber: null,
                            OrganizationForm: "AS",
                            Status: "Active",
                        },
                        antallSykmeldinger: 0,
                    },
                ])
            }
        );
    }
}

