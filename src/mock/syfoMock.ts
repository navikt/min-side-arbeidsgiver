import fetchMock from "fetch-mock";

fetchMock
  .get("/ditt-nav-arbeidsgiver/api/narmesteleder", {
    narmesteLedere: [
      {
        aktor: "1000029353768",
        orgnummer: "974553376",
        tilgangFom: "2016-12-21",
        skrivetilgang: true,
        tilganger: ["SYKMELDING", "SYKEPENGESOKNAD", "MOTE", "OPPFOLGINGSPLAN"]
      },
      {
        aktor: "1000041748629",
        orgnummer: "975266761",
        tilgangFom: "2016-12-21",
        skrivetilgang: true,
        tilganger: ["SYKMELDING", "SYKEPENGESOKNAD", "MOTE", "OPPFOLGINGSPLAN"]
      },
      {
        aktor: "1000009723233",
        orgnummer: "973445995",
        tilgangFom: "2016-12-15",
        skrivetilgang: true,
        tilganger: ["SYKMELDING", "SYKEPENGESOKNAD", "MOTE", "OPPFOLGINGSPLAN"]
      }
    ],
    humanResources: []
  })
  .spy();
