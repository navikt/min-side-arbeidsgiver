import fetchMock from "fetch-mock";
import { digiSyfoNarmesteLederLink, digisyfoSykemeldteLenke } from "../lenker";

fetchMock
  .get(digiSyfoNarmesteLederLink, {
    tilgang: true
  })
  .spy();

fetchMock
  .get(digisyfoSykemeldteLenke(), [
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
