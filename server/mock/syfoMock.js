export const mock = (app) => {
    app.use(
        '/min-side-arbeidsgiver/api/narmesteleder/virksomheter-v3', (req, res) => {
            res.send([
                {
                    organisasjon: {
                        OrganizationNumber: "999999999",
                        Name: "Saltrød og Høneby",
                        Type: "Business",
                        ParentOrganizationNumber: "121488424",
                        OrganizationForm: "BEDR",
                        Status: "Active",
                    },
                    antallSykmeldte: 0,
                },
                {
                    organisasjon: {
                        OrganizationNumber: "121488424",
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
                        OrganizationNumber: "182345674",
                        ParentOrganizationNumber : "118345674",
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
                        OrganizationNumber: "118345674",
                        OrganizationForm: "FLI",
                        Status: "Active"
                    },
                    antallSykmeldte: 0,
                },
            ])
        }
    );
}