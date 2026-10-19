# Spesifikasjon: Antall arbeidsforhold fra aareg-services

> Handover-spesifikasjon for GitHub Copilot / utvikler.
> Repo: `navikt/min-side-arbeidsgiver` (React 19 + TypeScript + Vite frontend, Express BFF).
> Trello: [#657 erstatte kall mot arbeidsgiver-innsyn-aareg med kall mot aareg-services](https://trello.com/c/nhonb0wT/657-erstatte-kall-mot-arbeidsgiver-innsyn-aareg-med-kall-mot-aareg-services) (kort-ID `6ad64707e113cfa3859bd47c`).

## 1. Mål

Tjenesteboksen **«Arbeidsforhold»** på forsiden viser antall arbeidsforhold (aktive og avsluttede) for valgt virksomhet. Tallet hentes i dag fra **`aareg-innsyn-arbeidsgiver-api`** (repo `navikt/arbeidsgiver-innsyn-aareg-api`), som skal legges ned.

Boksen skal i stedet hente tallet direkte fra **`aareg-services`** (team arbeidsforhold), endepunktet
**`POST /api/v2/opplysningspliktig/arbeidsstedoversikt`** (operationId `finnArbeidsstedoversikterPrOpplysningspliktig`, [swagger dev](https://aareg-services.dev.intern.nav.no/swagger-ui/index.html?urls.primaryName=aareg.api.v2#/opplysningspliktig/finnArbeidsstedoversikterPrOpplysningspliktig)).

Tallet som vises skal være det samme som før: `aktiveArbeidsforhold + inaktiveArbeidsforhold` for underenheten.

Utseende, tekster, lenkemål og tilgangsstyring (`altinntilgang.arbeidsforhold`) på boksen endres **ikke**.

### Beslutninger fra kortet

- Kortbeskrivelsen: nytt endepunkt i aareg-services skal matche og erstatte det gamle API-et.
- Kortbeskrivelsen: `accessPolicy.outbound` endres til ny app, og token-veksling får riktig audience.
- Kortbeskrivelsen: aareg-services har allerede satt opp inbound accessPolicy for oss. **Bekreftet**
- Kommentar fra Ken Gullaksen (2026-10-19): Slack-tråden ([#CAY78MSH5](https://nav-it.slack.com/archives/CAY78MSH5/p1791267150947829?thread_ts=1791186929.704679&cid=CAY78MSH5)) inneholder ikke noe utover kortet.

## 2. Kontekst: hva gjør den gamle løsningen?

Kallkjede i dag:

```
Frontend  GET /min-side-arbeidsgiver/arbeidsgiver-arbeidsforhold-api/antall-arbeidsforhold
          headere: orgnr=<underenhet>, jurenhet=<parent.orgnr>
  → BFF (TokenX, audience {dev|prod}-fss:arbeidsforhold:aareg-innsyn-arbeidsgiver-api)
  → aareg-innsyn-arbeidsgiver-api  GET /antall-arbeidsforhold
  → aareg-services  GET /api/v1/opplysningspliktig/arbeidsgiveroversikt
                    (Nav-Arbeidsgiverident=<underenhet>, Nav-Opplysningspliktigident=<jurenhet>,
                     Nav-Aareg-Kontekst=ARBEIDSGIVER)
```

Respons til frontend: `{ "first": "<opplysningspliktig orgnr>", "second": <antall | null> }`. Frontend bruker kun `second` (`null` ⇒ `0`).

Logikken i det gamle API-et ([`AaregClient.kt#L55`](https://github.com/navikt/arbeidsgiver-innsyn-aareg-api/blob/f6e3b7ad84b735abd937302a56c8ad8f8e1439dc/src/main/kotlin/no/nav/tag/innsynAareg/client/aareg/AaregClient.kt#L55), `InnsynService.hentAntallArbeidsforholdPåUnderenhet`):

1. Henter **alle** arbeidssteder for opplysningspliktig (`jurenhet`) fra aareg-services v1, og filtrerer ut den med `arbeidsgiver.organisasjonsnummer == orgnr`. Antall = `aktiveArbeidsforhold + inaktiveArbeidsforhold`.
2. Finnes ikke underenheten under `jurenhet` (typisk når parent er et **organisasjonsledd** og ikke den opplysningspliktige), slår den opp orgtreet i Enhetsregisteret og prøver organisasjonsleddene oppover til den finner et treff, og til slutt juridisk enhet.

Det nye v2-endepunktet gjør filtreringen i steg 1 på serversiden: det tar én opplysningspliktig og ett arbeidssted og returnerer kun det arbeidsstedet. Steg 2 (traversering av orgtreet) må vi håndtere selv, se §3.3.

### Nytt endepunkt (fra OpenAPI `aareg.api.v2`)

```
POST /api/v2/opplysningspliktig/arbeidsstedoversikt
Headere:  Authorization: Bearer <OBO-token>     (påkrevd)
          Nav-Aareg-Kontekst: ARBEIDSGIVER      (valgfri, default PRIVAT, må settes)
Body:     { "opplysningspliktigId": "<orgnr>", "arbeidsstedId": "<orgnr>" }
200:      Arbeidsstedoversikt {
            opplysningspliktig: Hovedenhet | Person,
            arbeidssted: Underenhet | Person,
            aktiveArbeidsforhold: int32,
            inaktiveArbeidsforhold: int32
          }
          eller tom body (se under)
400/401/403/500: TjenestefeilResponse { meldinger: string[] }
```

Ingen felt i responsen er markert `required` i skjemaet. Vi leser bare de to tallene.

**Atferd i aareg-services** (fra kontrolleren `hentArbeidsstedoversikt` og `finnArbeidsgiveroversikt`, delt av Ken Gullaksen 2026-10-19):

- Tjenesten henter alle arbeidssteder for `opplysningspliktigId` og filtrerer på `arbeidsstedId`, samme logikk som steg 1 i den gamle løsningen.
- **Ingen treff gir `200` med tom body** (`ok(null)`), ikke `404`. Det samme skjer når tilgangskontrollen (`filtrerArbeidsgiveroversikter`) filtrerer bort arbeidsstedet. Vi kan altså ikke skille «feil opplysningspliktig» fra «ingen tilgang til dette arbeidsstedet». Begge betyr «prøv neste kandidat».
- `403` kommer når konteksten er `PRIVAT` eller `SAKSBEHANDLER` (derfor må `Nav-Aareg-Kontekst: ARBEIDSGIVER` settes), eller ved `UnauthorizedException`. Det er en reell feil.
- `400` kommer når `opplysningspliktigId` eller `arbeidsstedId` mangler eller er blank.

### Hvor aareg-services kjører

aareg-services kjører i FSS, namespace `arbeidsforhold`, og nås fra GCP via `*-fss-pub`-ingress. Samme mønster som `tiltaksgjennomforing-api` i `server/server.js` i dag.

| Miljø | App | TokenX-audience | URL fra GCP |
|---|---|---|---|
| dev (q2) | `aareg-services-nais` | `dev-fss:arbeidsforhold:aareg-services-nais` | `https://aareg-services-q2.dev-fss-pub.nais.io` |
| prod | `aareg-services-nais` | `prod-fss:arbeidsforhold:aareg-services-nais` | `https://aareg-services.prod-fss-pub.nais.io` |

Dev bruker **q2**: det er der vi har fått tilgang (avklart av Ken Gullaksen 2026-10-19). Det gamle API-et brukte q1 i dev, så testdataene i dev kan være andre enn før. I dev-fss heter q2-appen `aareg-services-nais` (q1 er `aareg-services-nais-q1`). aareg-services' egen dokumentasjon bruker audience `dev-fss:arbeidsforhold:aareg-services-nais` for TokenX-tokens til arbeidsgivere. Andre team (f.eks. `sykepengesoknad-backend`) bruker samme app med host `aareg-services-q2.dev-fss-pub.nais.io`. Endepunktet finnes på den hosten (sjekket i OpenAPI-dokumentet).

## 3. Endringer som må gjøres

Fire lag berøres: **BFF-proxy**, **NAIS-konfig**, **frontend-hook** og **mocks/test**.

---

### 3.1 BFF-proxy (`server/server.js`)

Erstatt hele `app.use('/min-side-arbeidsgiver/arbeidsgiver-arbeidsforhold-api', ...)`-blokken med en ny rute.

Proxyen skal kun slippe gjennom **akkurat dette ene kallet**, ikke åpne hele aareg-services for nettleseren. aareg-services har mange endepunkter, blant annet arbeidsforholdoversikter med personopplysninger. Derfor:

- `app.post(<eksakt path>, ...)` i stedet for `app.use(<prefiks>, ...)`: Express matcher da både metode og eksakt path.
- Fast upstream-path med `pathRewrite`, slik at klienten ikke kan styre hvilken path som kalles hos aareg-services.
- BFF-en **setter** `Nav-Aareg-Kontekst: ARBEIDSGIVER` (overskriver evt. verdi fra klienten), slik at klienten ikke kan be om en annen tilgangskontekst.

```js
app.post(
    '/min-side-arbeidsgiver/aareg-services/arbeidsstedoversikt',
    tokenXMiddleware({
        log: log,
        audience: {
            dev: 'dev-fss:arbeidsforhold:aareg-services-nais',
            prod: 'prod-fss:arbeidsforhold:aareg-services-nais',
        }[MILJO],
    }),
    createProxyMiddleware({
        ...proxyOptions,
        pathRewrite: () => '/api/v2/opplysningspliktig/arbeidsstedoversikt',
        on: {
            proxyReq: (proxyReq) => {
                proxyReq.setHeader('Nav-Aareg-Kontekst', 'ARBEIDSGIVER');
            },
        },
        target: {
            dev: 'https://aareg-services-q2.dev-fss-pub.nais.io',
            prod: 'https://aareg-services.prod-fss-pub.nais.io',
        }[MILJO],
    })
);
```

**Body:** BFF-en har ingen body-parser (`express.json()` e.l.) foran proxyene, så POST-body strømmes uendret videre. Ikke legg til body-parsing på denne ruten.

**Respons:** sendes uendret tilbake. Responsen gjelder én virksomhet brukeren selv har tilgang til, og aareg-services gjør tilgangskontrollen. Vi filtrerer derfor ikke feltene i BFF-en, i motsetning til `tiltaksgjennomforing-api`.

**`on.proxyReq` og plugins:** `proxyOptions` har ingen `on`, så `on.proxyReq` her overskriver ingenting. `cookieScraperPlugin` registrerer sin egen `proxyReq`-lytter og fjerner fortsatt cookies før kallet går til aareg-services.

---

### 3.2 NAIS accessPolicy (`nais/dev-gcp.yaml` og `nais/prod-gcp.yaml`)

Bytt ut `aareg-innsyn-arbeidsgiver-api` med aareg-services i begge filene.

**dev-gcp.yaml:**

```yaml
      external:
        # fjern: - host: aareg-innsyn-arbeidsgiver-api.dev-fss-pub.nais.io
        - host: aareg-services-q2.dev-fss-pub.nais.io
      rules:
        # fjern: aareg-innsyn-arbeidsgiver-api / arbeidsforhold / dev-fss
        - application: aareg-services-nais
          namespace: arbeidsforhold
          cluster: dev-fss
```

**prod-gcp.yaml:**

```yaml
      external:
        # fjern: - host: aareg-innsyn-arbeidsgiver-api.prod-fss-pub.nais.io
        - host: aareg-services.prod-fss-pub.nais.io
      rules:
        # fjern: aareg-innsyn-arbeidsgiver-api / arbeidsforhold / prod-fss
        - application: aareg-services-nais
          namespace: arbeidsforhold
          cluster: prod-fss
```

`external.host` åpner nettverket ut av GCP. `rules`-oppføringen med `cluster:` følger mønsteret som brukes for `tiltaksgjennomforing-api` i dag. Inbound-siden hos aareg-services er bekreftet satt opp (se §1).

---

### 3.3 Frontend: datahenting-hook

Fil: `src/Pages/Hovedside/Tjenestebokser/Arbeidsforhold/useAntallArbeidsforholdFraAareg.ts`

Behold navn og signatur (`(): number`), så `Arbeidsforhold.tsx` ikke endres. Behold SWR, retry-teller, `erStøy`-sjekk, `#FARO:`-logging og `fallbackData: 0`.

**Hvem er opplysningspliktig?** Vi kjenner ikke opplysningspliktig direkte. For å erstatte steg 2 i den gamle løsningen (§2) prøver vi organisasjonene **oppover i treet**, fra `parent` til `øversteLedd`. Treet har vi allerede i `OrganisasjonerOgTilgangerContext` (`orgnrTilParentMap`), så vi slipper et eget Enhetsregisteret-oppslag.

- I de fleste tilfeller er `parent` den juridiske enheten og opplysningspliktig: ett kall.
- Er `parent` et organisasjonsledd, prøves neste nivå opp, til og med `øversteLedd`.
- Første kandidat som gir treff brukes. Ingen treff ⇒ `0`.

**Hva er «ikke treff»?** aareg-services svarer `200` med tom body når arbeidsstedet ikke finnes under opplysningspliktig, eller når tilgangskontrollen filtrerer det bort (se §2). Fetcheren leser derfor body som tekst: tom body (eller `null`) betyr «prøv neste kandidat». Alle ikke-200-svar er feil (kastes, SWR prøver igjen). Det gjelder også `403`, fordi den bare kommer ved feil kontekst eller ugyldig token, ikke ved feil opplysningspliktig.

```ts
import { z } from 'zod';
import useSWR from 'swr';
import { useState } from 'react';
import { erStøy } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { useOrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerContext';

const Arbeidsstedoversikt = z.object({
    aktiveArbeidsforhold: z.number().nullish(),
    inaktiveArbeidsforhold: z.number().nullish(),
});

// parent, parent.parent, ... til og med øverste ledd. Erstatter traverseringen av
// orgtreet som aareg-innsyn-arbeidsgiver-api gjorde mot Enhetsregisteret.
const kandidaterForOpplysningspliktig = (
    orgnr: string,
    orgnrTilParentMap: Map<string, string>
): string[] => {
    const kandidater: string[] = [];
    let gjeldende = orgnrTilParentMap.get(orgnr);
    while (gjeldende !== undefined && !kandidater.includes(gjeldende)) {
        kandidater.push(gjeldende);
        gjeldende = orgnrTilParentMap.get(gjeldende);
    }
    return kandidater;
};

const fetcher = async ({
    url,
    arbeidsstedId,
    opplysningspliktigIder,
}: {
    url: string;
    arbeidsstedId: string;
    opplysningspliktigIder: string[];
}): Promise<number> => {
    for (const opplysningspliktigId of opplysningspliktigIder) {
        const respons = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ opplysningspliktigId, arbeidsstedId }),
        });
        if (respons.status !== 200) throw respons;

        // aareg-services svarer 200 uten body når arbeidsstedet ikke hører til
        // opplysningspliktig (eller er filtrert bort av tilgangskontrollen).
        const body = (await respons.text()).trim();
        if (body === '' || body === 'null') continue;

        const { aktiveArbeidsforhold, inaktiveArbeidsforhold } = Arbeidsstedoversikt.parse(
            JSON.parse(body)
        );
        return (aktiveArbeidsforhold ?? 0) + (inaktiveArbeidsforhold ?? 0);
    }
    return 0;
};

export const useAntallArbeidsforholdFraAareg = (): number => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const { orgnrTilParentMap } = useOrganisasjonerOgTilgangerContext();
    const [retries, setRetries] = useState(0);
    const arbeidsstedId = valgtOrganisasjon.organisasjon.orgnr;
    const opplysningspliktigIder = kandidaterForOpplysningspliktig(arbeidsstedId, orgnrTilParentMap);

    const { data } = useSWR(
        opplysningspliktigIder.length > 0
            ? {
                  url: `${__BASE_PATH__}/aareg-services/arbeidsstedoversikt`,
                  arbeidsstedId,
                  opplysningspliktigIder,
              }
            : null,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                setRetries((x) => x + 1);
                if (retries === 5 && !erStøy(error)) {
                    console.error(
                        `#FARO: hent antall arbeidsforhold fra aareg-services feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
            },
            errorRetryInterval: 300,
            fallbackData: 0,
        }
    );

    return data;
};
```

Merknader:

- **Ingen parent** (valgt organisasjon er toppnivå): SWR-nøkkel `null`, ingen kall, `0` vises. Gammel løsning sendte `jurenhet: ''`, som ga `null` ⇒ `0`. Samme resultat.
- **Atferdsforskjell:** gammel løsning hoppet videre fra et organisasjonsledd som ga treff med `0` arbeidsforhold. Ny løsning stopper på første treff. Vi antar at et organisasjonsledd som faktisk er opplysningspliktig for underenheten, er riktig svar også når tallet er `0`.
- **Personopplysninger:** body og respons inneholder bare orgnr og antall. Ingen logging av respons. `#FARO`-loggen inneholder kun statuskode.

---

### 3.4 Mocks (demo-modus)

`src/mocks/scenarios/dagligLederScenario.ts`: erstatt `http.get('/min-side-arbeidsgiver/arbeidsgiver-arbeidsforhold-api/antall-arbeidsforhold', ...)` med:

```ts
http.post('/min-side-arbeidsgiver/aareg-services/arbeidsstedoversikt', () =>
    HttpResponse.json({
        aktiveArbeidsforhold: 30,
        inaktiveArbeidsforhold: 12,
    })
),
```

Demo viser da fortsatt `42`, som i dag.

---

### 3.5 Tester

- `src/tests/A11y.test.tsx`: erstatt `http.get(/.*arbeidsgiver-arbeidsforhold-api\/antall-arbeidsforhold.*/, ...)` med `http.post(/.*aareg-services\/arbeidsstedoversikt.*/, ...)` som svarer `{ aktiveArbeidsforhold: 50, inaktiveArbeidsforhold: 3 }` (fortsatt `53`).
- Ny test ved siden av hooken (Vitest + Testing Library + MSW), få og fokuserte tilfeller:
  1. Viser `aktive + inaktive` når parent gir 200 med body.
  2. Parent gir 200 med tom body, øverste ledd gir 200 med body ⇒ tallet fra øverste ledd vises, og det ble sendt to kall med riktig `opplysningspliktigId`.
  3. Ingen kandidat gir treff (alle 200 med tom body) ⇒ `0`.
- Kjør `pnpm test` og `pnpm lint`.

BFF-ruten har ingen eksisterende testoppsett. Verifiser den i dev (se §4).

## 4. Akseptansekriterier

- [ ] Tjenesteboksen «Arbeidsforhold» viser `aktiveArbeidsforhold + inaktiveArbeidsforhold` fra `POST /api/v2/opplysningspliktig/arbeidsstedoversikt` i aareg-services.
- [ ] I dev (q2) viser boksen et tall for minst én testvirksomhet der parent er juridisk enhet, og én der parent er et organisasjonsledd (hvis vi finner en slik testvirksomhet). Tallene sammenlignes ikke med det gamle API-et, fordi det brukte q1.
- [ ] BFF proxyer kun `POST /min-side-arbeidsgiver/aareg-services/arbeidsstedoversikt`, med TokenX OBO-token (audience `dev-fss:arbeidsforhold:aareg-services-nais` / `prod-fss:arbeidsforhold:aareg-services-nais`) og `Nav-Aareg-Kontekst: ARBEIDSGIVER`. `GET` eller andre paths under `/min-side-arbeidsgiver/aareg-services/` når ikke aareg-services.
- [ ] Ved feil vises `0` og boksen krasjer ikke. Gjentatte feil logges med `#FARO:`-prefiks (ikke ved støy).
- [ ] Ingen referanser til `aareg-innsyn-arbeidsgiver-api` / `arbeidsgiver-arbeidsforhold-api` igjen i `server/`, `nais/` eller `src/`.
- [ ] Demo-modus viser fortsatt `42`.
- [ ] `pnpm test` og `pnpm lint` passerer.

## 5. Åpne punkter å avklare (før/under implementasjon)

Alle punkter avklart av Ken Gullaksen 2026-10-19.

1. ~~Dev-instans~~: **avklart:** vi har fått tilgang til **q2** (`aareg-services-nais` i dev-fss, host `aareg-services-q2.dev-fss-pub.nais.io`), ikke q1. *(§2, §3.1, §3.2)*
2. ~~Svar ved «ikke treff»~~: **avklart** fra kildekoden til aareg-services: `200` med tom body, både ved feil opplysningspliktig og når tilgangskontrollen filtrerer bort arbeidsstedet. *(§2, §3.3)*
3. ~~Organisasjonsledd i treet~~: **avklart:** hele treet finnes i `orgnrTilParentMap`, og fallbacken oppover i treet er ok. *(§3.3)*
4. ~~Tidspunkt for nedleggelse~~: **avklart:** ikke relevant for denne endringen. Tilbakerulling er revert av PR-en.

## 6. Relevante filer (referanse)

| Formål | Fil |
|---|---|
| Tjenesteboks (uendret) | `src/Pages/Hovedside/Tjenestebokser/Arbeidsforhold/Arbeidsforhold.tsx` |
| Datahenting (endres) | `src/Pages/Hovedside/Tjenestebokser/Arbeidsforhold/useAntallArbeidsforholdFraAareg.ts` |
| Organisasjonstre / parent-map | `src/Pages/OrganisasjonerOgTilgangerContext.ts` (`orgnrTilParentMap`) |
| Valgt virksomhet | `src/Pages/OrganisasjonsDetaljerContext.ts` |
| BFF-proxy + TokenX | `server/server.js`, `server/tokenx.js` |
| NAIS-konfig | `nais/dev-gcp.yaml`, `nais/prod-gcp.yaml` |
| Mocks (demo) | `src/mocks/scenarios/dagligLederScenario.ts` |
| A11y-test | `src/tests/A11y.test.tsx` |
| Gammel løsning (referanse) | [`AaregClient.kt`](https://github.com/navikt/arbeidsgiver-innsyn-aareg-api/blob/f6e3b7ad84b735abd937302a56c8ad8f8e1439dc/src/main/kotlin/no/nav/tag/innsynAareg/client/aareg/AaregClient.kt), [`InnsynService.kt`](https://github.com/navikt/arbeidsgiver-innsyn-aareg-api/blob/f6e3b7ad84b735abd937302a56c8ad8f8e1439dc/src/main/kotlin/no/nav/tag/innsynAareg/service/InnsynService.kt) |
