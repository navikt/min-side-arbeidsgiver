import fetchMock from "fetch-mock";

fetchMock.get(
  "/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/arbeidsgiver/811076422",
  200
);
fetchMock.get(
  "/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/stillinger/numberByStatus",
  {
    TIL_GODKJENNING: 17,
    GODKJENT: 0,
    PAABEGYNT: 42,
    TIL_AVSLUTTING: 0,
    AVSLUTTET: 5,
    AVVIST: 0,
    PUBLISERT: 0
  }
);

fetchMock
  .get(
    "begin:/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/arbeidsgiver/",
    401
  )
  .spy();
