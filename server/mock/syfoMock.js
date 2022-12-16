module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/api/narmesteleder/virksomheter-v3', (req, res) => {
                res.send([
                    {
                        organisasjon: {
                            OrganizationNumber: "999911111",
                            Name: "Saltrød og Høneby",
                            Type: "Business",
                            ParentOrganizationNumber: "910811111",
                            OrganizationForm: "BEDR",
                            Status: "Active",
                        },
                        antallSykmeldte: 0,
                    },
                    {
                        organisasjon: {
                            OrganizationNumber: "910811111",
                            Name: "BIRTAVARRE OG VÆRLANDET FORELDER",
                            Type: "Enterprise",
                            ParentOrganizationNumber: null,
                            OrganizationForm: "AS",
                            Status: "Active",
                        },
                        antallSykmeldte: 0,
                    },
                    {
                        organisasjon: {
                            Name: "BALLSTAD OG HAMARØY",
                            OrganizationForm: "AAFY",
                            OrganizationNumber: "811011111",
                            ParentOrganizationNumber : "811011111",
                            Status: "Active",
                            Type: "Business",
                        },
                        antallSykmeldte: 4,
                    },
                    {
                        organisasjon: {
                            Name: "BALLSTAD OG HORTEN",
                            Type: "Enterprise",
                            ParentOrganizationNumber: null,
                            OrganizationNumber: "811011111",
                            OrganizationForm: "FLI",
                            Status: "Active"
                        },
                        antallSykmeldte: 0,
                    },
                ])
            }
        );
    }
}

