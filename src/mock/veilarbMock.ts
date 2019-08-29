import fetchMock from "fetch-mock";

fetchMock.get("/min-side-arbeidsgiver/veilarbstepup/status", {
  erInnlogget: false,
  harGyldigOidcToken: false,
  brukerId: null,
  niva: null,
  nivaOidc: null
});
