# Spesifikasjon: Tjenesteboks «Oversikt over nærmeste leder sykefravær»

> Handover-spesifikasjon for GitHub Copilot / utvikler.
> Repo: `navikt/min-side-arbeidsgiver` (React 19 + TypeScript + Vite frontend, Express BFF).

## 1. Mål

Lag en ny tjenesteboks på forsiden (Hovedside) med tittelen **«Oversikt over nærmeste leder sykefravær»**.

Boksen skal:

- Være tilgangsstyrt på Altinn-tjenesten **`oppgiNarmesteleder`** (`nav_syfo_oppgi-narmesteleder`). Boksen vises kun når innlogget bruker har denne tilgangen for den valgte virksomheten.
- Vise et stort tall: antall **«sykmeldte mangler leder»**.
- Hente tallet fra backend-tjenesten **`esyfo-narmesteleder`** (team `team-esyfo`) på path **`/linemanager/requirement`**.
- Kun bruke feltet **`meta.total`** fra responsen (f.eks. `42`). Alle andre felter ignoreres. `meta.total` er totalt antall rader i databasen (SQL `count`) — altså det fulle antallet på tvers av alle sider, **ikke** begrenset av `pageSize`. Vi kan derfor lese `meta.total` direkte uten paginering.

> ⚠️ **Midlertidig endepunkt.** `/linemanager/requirement` er et midlertidig endepunkt inntil team-esyfo lager et mer spesifikt endepunkt. Kode og kommentarer bør reflektere at dette er midlertidig, slik at det er lett å bytte ut senere.

## 2. Kontekst og eksisterende mønstre

Følg de etablerte mønstrene i repoet. De to nærmeste forbildene er:

- **Tjenesteboks med API-hentet tall:** `src/Pages/Hovedside/Tjenestebokser/Arbeidsforhold/` (komponent + `useAntallArbeidsforholdFraAareg.ts`-hook som henter tall via BFF-proxy med SWR).
- **Syfo-relatert tjenesteboks:** `src/Pages/Hovedside/Tjenestebokser/Sykmeldte/Sykmeldte.tsx`.

Basiskomponenter som skal gjenbrukes ligger i `src/Pages/Hovedside/Tjenestebokser/Tjenesteboks.tsx`:

```tsx
// Tjenesteboks tar: ikon (svg-import), href (string), tittel (string), 'aria-label' (string), children
<Tjenesteboks ikon={ikon} href={href} tittel="..." aria-label="...">
  <StortTall>{tall}</StortTall> ...
</Tjenesteboks>
```

Registrering/tilgangsstyring av bokser skjer i `src/Pages/Hovedside/Tjenestebokser/Tjenestebokser.tsx`.

## 3. Endringer som må gjøres

Fire lag berøres: **BFF-proxy**, **NAIS-konfig**, **frontend (hook + komponent + registrering)** og **mocks/test**.

---

### 3.1 BFF-proxy (`server/server.js`)

Legg til en ny proxy-rute i blokken `if (MILJO === 'dev' || MILJO === 'prod') { ... }`, etter de eksisterende `app.use(...)`-proxyene. Bruk `tokenXMiddleware` for OBO-token-veksling (se `server/tokenx.js`) — samme mønster som `presenterte-kandidater-api` (som også er en in-cluster GCP-tjeneste i et annet namespace).

```js
app.use(
    '/min-side-arbeidsgiver/esyfo-narmesteleder',
    tokenXMiddleware({
        log: log,
        audience: {
            dev: 'dev-gcp:team-esyfo:esyfo-narmesteleder',
            prod: 'prod-gcp:team-esyfo:esyfo-narmesteleder',
        }[MILJO],
    }),
    createProxyMiddleware({
        ...proxyOptions,
        // Midlertidig endepunkt – team-esyfo lager et mer spesifikt endepunkt senere.
        target: 'http://esyfo-narmesteleder.team-esyfo',
    })
);
```

**Path-håndtering:** Express strimler av mount-pathen (`/min-side-arbeidsgiver/esyfo-narmesteleder`), og `http-proxy-middleware` appender resten til `target`. Tjenesten (Ktor) serverer endepunktet på **`/api/v1/linemanager/requirement`**. Frontend kaller derfor `${__BASE_PATH__}/esyfo-narmesteleder/api/v1/linemanager/requirement`, som proxyet gir `http://esyfo-narmesteleder.team-esyfo/api/v1/linemanager/requirement`. ✅ Intern path bekreftet.

---

### 3.2 NAIS accessPolicy (`nais/dev-gcp.yaml` og `nais/prod-gcp.yaml`)

`esyfo-narmesteleder` kjøres i GCP i namespace `team-esyfo` (samme cluster som denne appen), så bruk en `accessPolicy.outbound.rules`-oppføring (ikke `external.host`) — akkurat som `presenterte-kandidater-api`.

Legg til under `spec.accessPolicy.outbound.rules` i **begge** filene:

```yaml
    - application: esyfo-narmesteleder
      namespace: team-esyfo
```

Ingen `cluster:`-felt trengs siden det er samme cluster (dev-gcp/prod-gcp). Ingen ny `external.host` er nødvendig fordi kallet går in-cluster via `http://esyfo-narmesteleder.team-esyfo`.

> 🔗 **TODO – koordiner med team-esyfo (påkrevd for at kallet skal fungere):** NAIS access policy må matche på begge sider.
> - **Vår side (denne PR-en):** legg til `outbound.rules`-oppføringen over.
> - **Team-esyfo sin side:** de må legge `min-side-arbeidsgiver` (namespace `fager`) til i sin **`accessPolicy.inbound.rules`** på `esyfo-narmesteleder`, i både dev og prod. Uten dette blir kallet avvist. Send forespørsel til team-esyfo og få det bekreftet før prod-deploy.

---

### 3.3 Frontend – datahenting-hook

Ny fil: `src/Pages/Hovedside/Tjenestebokser/NarmesteLederSykefravar/useAntallSykmeldteManglerLeder.ts`

Følg mønsteret fra `useAntallArbeidsforholdFraAareg.ts`: SWR, Zod-validering, retry-teller, `erStøy`-sjekk og `#FARO:`-logging ved gjentatte feil, `fallbackData: 0`.

**Påkrevde query-parametere** (fra Ktor `GET /api/v1/linemanager/requirement`):

| Parameter | Verdi | Merknad |
|---|---|---|
| `orgNumber` | Orgnr for valgt virksomhet | Påkrevd. Ugyldig format ⇒ 400. Hentes fra `useOrganisasjonsDetaljerContext()`. |
| `createdAfter` | **I dag minus 1 år**, ISO-8601 instant | Påkrevd. Parses med `Instant.parse` på backend, så den **må** være et fullt instant med `Z` (f.eks. `2025-07-01T00:00:00.000Z`) — ikke bare dato. Beregnes **inne i fetcheren** (se under), ikke i SWR-nøkkelen. |
| `pageSize` | (utelates) | Valgfri; irrelevant siden vi kun bruker `meta.total`. |

> **Om `createdAfter`:** Denne beregnes inne i fetcheren, ikke som del av SWR-nøkkelen. Grunnen: `createdAfter` er en implementasjonsdetalj som forsvinner når team-esyfo lager det nye endepunktet, og en tidsstemplet nøkkel ville uansett gjort SWR-cachen unødig ustabil. SWR-nøkkelen holdes dermed på `{ url, orgNumber }`.

```ts
import { z } from 'zod';
import useSWR from 'swr';
import { useState } from 'react';
import { erStøy } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

// Midlertidig endepunkt hos team-esyfo. Kun meta.total brukes.
const Requirement = z
    .object({
        meta: z.object({ total: z.number() }),
    })
    .passthrough();

// createdAfter = i dag minus 1 år (fullt ISO-instant). Midlertidig detalj – forsvinner
// med det nye endepunktet, derfor beregnet her og holdt utenfor SWR-nøkkelen.
const createdAfterEttÅrSiden = (): string => {
    const d = new Date();
    d.setUTCFullYear(d.getUTCFullYear() - 1);
    return d.toISOString();
};

const fetcher = async ({
    url,
    orgNumber,
}: {
    url: string;
    orgNumber: string;
}): Promise<number> => {
    const params = new URLSearchParams({
        orgNumber,
        createdAfter: createdAfterEttÅrSiden(),
    });
    const respons = await fetch(`${url}?${params}`);
    if (respons.status !== 200) throw respons;
    return Requirement.parse(await respons.json()).meta.total;
};

export const useAntallSykmeldteManglerLeder = (): number => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const orgNumber = valgtOrganisasjon.organisasjon.orgnr;
    const [retries, setRetries] = useState(0);

    const { data } = useSWR(
        {
            url: `${__BASE_PATH__}/esyfo-narmesteleder/api/v1/linemanager/requirement`,
            orgNumber,
        },
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                setRetries((x) => x + 1);
                if (retries === 5 && !erStøy(error)) {
                    console.error(
                        `#FARO: hent antall sykmeldte mangler leder fra esyfo-narmesteleder feilet med ${
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

---

### 3.4 Frontend – tjenesteboks-komponent

Ny fil: `src/Pages/Hovedside/Tjenestebokser/NarmesteLederSykefravar/NarmesteLederSykefravar.tsx`

Gjenbruk `Tjenesteboks` og `StortTall`. Følg `Sykmeldte.tsx`/`Arbeidsforhold.tsx` for struktur, `gittMiljo` for miljøavhengig `href`, og bunntekst-tekst.

```tsx
import React from 'react';
// Egen kopi av ikonet fra «Avtaler om tiltak» (samme grafikk), lagt i denne mappen.
import ikon from './narmeste-leder-sykefravar-ikon-kontrast.svg';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import { useAntallSykmeldteManglerLeder } from './useAntallSykmeldteManglerLeder';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { gittMiljo } from '../../../../utils/environment';

const NarmesteLederSykefravar = () => {
    const antall = useAntallSykmeldteManglerLeder();
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

    // Lenkemål: nytt oversikt-frontend (ikke oppgi-nærmeste-leder-skjemaet).
    const href = `${gittMiljo({
        prod: 'https://www.nav.no/arbeidsgiver/ansatte/narmesteleder/oversikt',
        other: 'https://www.ekstern.dev.nav.no/arbeidsgiver/ansatte/narmesteleder/oversikt',
    })}?orgnr=${valgtOrganisasjon.organisasjon.orgnr}`;

    return (
        <Tjenesteboks
            ikon={ikon}
            href={href}
            tittel="Oversikt over nærmeste leder sykefravær"
            aria-label={`Oversikt over nærmeste leder sykefravær, ${antall} sykmeldte mangler leder`}
        >
            <div>
                <StortTall>{antall}</StortTall>
                <div className="tjenesteboks_bunntekst">sykmeldte mangler leder</div>
            </div>
        </Tjenesteboks>
    );
};

export default NarmesteLederSykefravar;
```

**Assets/CSS:**
- **Ikon:** Samme grafikk som «Avtaler om tiltak», men lag en **egen kopi** av fila i den nye mappen — ikke importer på tvers av mapper. Kopier `src/Pages/Hovedside/Tjenestebokser/TiltakAvtaler/tiltak-avtaler-ikon-kontrast.svg` til `src/Pages/Hovedside/Tjenestebokser/NarmesteLederSykefravar/narmeste-leder-sykefravar-ikon-kontrast.svg` (uendret innhold) og importer den lokale kopien.
- Evt. egen CSS-fil hvis bunntekst trenger egen styling (se `Sykemeldte.css` / `Arbeidsforhold.css`).

> **Lenkemål (`href`):** Peker til et **nytt oversikt-frontend** på `/arbeidsgiver/ansatte/narmesteleder/oversikt` (dev: `www.ekstern.dev.nav.no`, prod: `www.nav.no`) — **ikke** oppgi-nærmeste-leder-skjemaet. `?orgnr=<orgnr>` legges på for valgt virksomhet (målappen leser `searchParams.orgnr`, **ikke** `?bedrift`). Merk at målsiden er et separat frontend som (etter planen) leveres av team-esyfo.

---

### 3.5 Registrer boksen (`src/Pages/Hovedside/Tjenestebokser/Tjenestebokser.tsx`)

1. Importer komponenten:
   ```tsx
   import NarmesteLederSykefravar from './NarmesteLederSykefravar/NarmesteLederSykefravar';
   ```
2. Legg `typeof NarmesteLederSykefravar` til i `TjenesteBoks`-uniontypen.
3. Legg til tilgangsstyring i `TjenesteboksContainer` (rekkefølge etter ønske fra UX):
   ```tsx
   if (valgtOrganisasjon.altinntilgang.oppgiNarmesteleder) {
       tjenester.push(NarmesteLederSykefravar);
   }
   ```

`valgtOrganisasjon.altinntilgang` er en `Record<NAVtjenesteId, boolean>` (se `src/Pages/OrganisasjonerOgTilgangerContext.ts`). `oppgiNarmesteleder` finnes allerede i `NAVtjenesteId` og er definert i `src/altinn/tjenester.ts` med `ressurs: 'nav_syfo_oppgi-narmesteleder'` — ingen endring nødvendig der.

---

### 3.6 Mocks (demo-modus)

Demo-modus bruker MSW (`src/mocks/`). Legg til en handler slik at boksen kan vises i demo.

I `src/mocks/handlers.ts` (eller ny fil i `src/mocks/handlers/` som spres inn i `handlers`-arrayet), legg til:

```ts
http.get('/min-side-arbeidsgiver/esyfo-narmesteleder/api/v1/linemanager/requirement', () =>
    HttpResponse.json({ meta: { total: 42 } })
),
```

Sørg for at demoprofilen `NarmesteLeder` (`src/hooks/useDemoprofil.ts`, se også `src/mocks/scenarios/nærmesteLederScenario.ts`) har `oppgiNarmesteleder`-tilgang slik at boksen faktisk rendres i demo.

---

### 3.7 Tester

- Legg til en enkel komponenttest (Vitest + Testing Library + MSW) ved siden av komponenten som verifiserer at tallet fra `meta.total` vises. Følg mønster fra eksisterende `*.test.tsx`.
- Verifiser at `src/tests/A11y.test.tsx` fortsatt passerer (jest-axe), siden boksen legges på forsiden.
- Kjør `pnpm test` og `pnpm lint`.

## 4. Akseptansekriterier

- [ ] Boksen «Oversikt over nærmeste leder sykefravær» vises **kun** når `valgtOrganisasjon.altinntilgang.oppgiNarmesteleder` er `true`.
- [ ] Boksen viser `meta.total` fra `GET /api/v1/linemanager/requirement?orgNumber=<orgnr>&createdAfter=<i dag − 1 år, ISO instant>` som et stort tall, med teksten «sykmeldte mangler leder».
- [ ] Ved feil/utilgjengelig API vises `0` (fallback) og boksen krasjer ikke; gjentatte feil logges med `#FARO:`-prefiks (ikke ved støy).
- [ ] BFF proxyer kallet med TokenX OBO-token til `esyfo-narmesteleder` (audience `{dev|prod}-gcp:team-esyfo:esyfo-narmesteleder`).
- [ ] `accessPolicy.outbound.rules` inneholder `esyfo-narmesteleder`/`team-esyfo` i både dev- og prod-NAIS-konfig.
- [ ] Demo-modus viser boksen med mocket verdi `42`.
- [ ] `pnpm test` og `pnpm lint` passerer.

## 5. Åpne punkter å avklare (før/under implementasjon)

1. ~~Lenkemål (`href`)~~ — **avklart:** nytt oversikt-frontend `/arbeidsgiver/ansatte/narmesteleder/oversikt` (+ `?orgnr=<orgnr>`). *(§3.4)*
2. ~~Eksakt intern path~~ — **avklart:** `/api/v1/linemanager/requirement`. *(§3.1)*
3. ~~Trenger endepunktet orgnr~~ — **avklart:** ja, query-param `orgNumber` + `createdAfter` (i dag − 1 år). *(§3.3)*
4. ~~Ikon~~ — **avklart:** egen kopi av «Avtaler om tiltak»-ikonet (`narmeste-leder-sykefravar-ikon-kontrast.svg`, kopiert fra `tiltak-avtaler-ikon-kontrast.svg`). Evt. tekst/rekkefølge fra UX gjenstår. *(§3.4)*
5. Endepunktet er **midlertidig** — hold koden lett å bytte når team-esyfo leverer nytt, mer spesifikt endepunkt.

## 6. Relevante filer (referanse)

| Formål | Fil |
|---|---|
| Basis-tjenesteboks-komponenter | `src/Pages/Hovedside/Tjenestebokser/Tjenesteboks.tsx` |
| Registrering + tilgangsstyring | `src/Pages/Hovedside/Tjenestebokser/Tjenestebokser.tsx` |
| Forbilde: boks med API-tall | `src/Pages/Hovedside/Tjenestebokser/Arbeidsforhold/` |
| Forbilde: syfo-boks | `src/Pages/Hovedside/Tjenestebokser/Sykmeldte/Sykmeldte.tsx` |
| Altinn-tjenestedefinisjon | `src/altinn/tjenester.ts` (`oppgiNarmesteleder`) |
| Tilgangstyper på virksomhet | `src/Pages/OrganisasjonerOgTilgangerContext.ts` |
| BFF-proxy + TokenX | `server/server.js`, `server/tokenx.js` |
| NAIS-konfig | `nais/dev-gcp.yaml`, `nais/prod-gcp.yaml` |
| Miljøhjelper | `src/utils/environment.ts` (`gittMiljo`) |
| Mocks (demo) | `src/mocks/handlers.ts`, `src/mocks/scenarios/nærmesteLederScenario.ts` |
