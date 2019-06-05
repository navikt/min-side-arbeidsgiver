import fetchMock from "fetch-mock";
import {digiSyfoNarmesteLederLink, digisyfoSykemeldteLenke} from "../lenker";

fetchMock
    .get(digiSyfoNarmesteLederLink, {
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

fetchMock
    .get(digisyfoSykemeldteLenke(),
        [
          {
            fnr: "",
            aktoerId: "1397174971178",
            orgnummer: "910532308",
            koblingId: 30968,
            navn: null
          },
          {
            fnr: "",
            aktoerId: "1563540214911",
            orgnummer: "910532251",
            koblingId: 30969,
            navn: null
          },
          {
            fnr: "",
            aktoerId: "1113726300051",
            orgnummer: "910532308",
            koblingId: 30801,
            navn: null
          }
        ])
    .spy();
