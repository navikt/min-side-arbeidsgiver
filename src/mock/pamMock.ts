import fetchMock from "fetch-mock";
import { pamSettBedriftLenke, pamHentStillingsannonserLenke } from "../lenker";

fetchMock.get(pamSettBedriftLenke("811076422"), 200);
fetchMock.get(pamHentStillingsannonserLenke(), {
  TIL_GODKJENNING: 17,
  GODKJENT: 0,
  PAABEGYNT: 42,
  TIL_AVSLUTTING: 0,
  AVSLUTTET: 5,
  AVVIST: 0,
  PUBLISERT: 0
});

fetchMock.get("/ditt-nav-arbeidsgover/api/narmesteleder", {
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
});

fetchMock.get("begin:" + pamSettBedriftLenke(""), 401).spy();
