module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/api/narmesteleder/virksomheter', (req, res) => {
                res.send([
                    {
                        OrganizationNumber: "999999999",
                        Name: "Saltrød og Høneby",
                        Type: "Business",
                        ParentOrganizationNumber: "910825555",
                        OrganizationForm: "BEDR",
                        Status: "Active",
                    },
                    {
                        OrganizationNumber: "910825555",
                        Name: "BIRTAVARRE OG VÆRLANDET FORELDER",
                        Type: "Enterprise",
                        ParentOrganizationNumber: null,
                        OrganizationForm: "AS",
                        Status: "Active",
                    },
                ])
            }
        );
        app.use(
            '/min-side-arbeidsgiver/api/narmesteleder', (req, res) => {
                res.send({ tilgang: true })
            }
        );
    }
}
