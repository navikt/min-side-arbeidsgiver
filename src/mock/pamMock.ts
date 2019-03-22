import fetchMock from "fetch-mock";

fetchMock.get("/pam/stillingsregistrering-api/api/arbeidsgiver/811076422", 200);
fetchMock
  .get("begin:/pam/stillingsregistrering-api/api/arbeidsgiver/", 401)
  .spy();
