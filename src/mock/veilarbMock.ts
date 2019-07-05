import fetchMock from "fetch-mock";


fetchMock.get("/ditt-nav-arbeidsgiver/veilarbstepup/status",
{erInnlogget: false, harGyldigOidcToken: false, brukerId: null, niva: null, nivaOidc: null}
);
