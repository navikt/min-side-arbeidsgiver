# AGENTS.md

Veiledning for AI-agenter som jobber i dette prosjektet.

## Hva er dette prosjektet?

**Min Side – Arbeidsgiver** er en React-basert nettapplikasjon laget for NAV. Den fungerer som en sentral portal der arbeidsgivere kan finne og bruke NAVs digitale tjenester. Applikasjonen henter data fra en rekke NAV-backend-tjenester via en Express-basert Backend-for-Frontend (BFF).

## Teknologistack

| Område | Teknologi |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| UI-komponenter | NAV Aksel Design System (`@navikt/ds-react`) |
| Routing | React Router DOM v7 |
| REST-datahenting | SWR |
| GraphQL | Apollo Client |
| Backend (BFF) | Express 5, Node.js |
| Autentisering | Wonderwall / IDporten / TokenX |
| Testing | Vitest, Testing Library, MSW, jest-axe |
| Bygging | Vite, TypeScript compiler |
| Pakkebehandler | pnpm |

## Prosjektstruktur

```
src/
  Pages/              # Sidekomponenter og ruting
    Hovedside/        # Forsiden med tjenestekort
    Saksoversikt/     # Saksoversikt
    OmVirksomheten/   # Info om valgt virksomhet
    ManglerTilganger/ # Tilgangsmangelside
    Pages.tsx         # Ruteroppsett og toppnivå-providers
    Banner.tsx        # Toppbanner med virksomhetsvelger
    *Context.ts       # React Context-definisjoner
  GeneriskeElementer/ # Gjenbrukbare UI-komponenter
  api/                # API-lag (SWR-hooks, GraphQL-typer)
  hooks/              # Custom React hooks
  altinn/             # Altinn-integrasjon (tilganger, org)
  mocks/              # MSW-handlers for demo-modus
  utils/              # Hjelpefunksjoner (analytics, dato, miljø)
  lenker.ts           # Lenke-konstanter
server/               # Express BFF (proxy + autentisering)
nais/                 # Kubernetes/NAIS-konfigurasjon
public/               # Statiske filer
build/                # Byggeresultat (generert, ikke commit)
```

## Viktige kommandoer

```bash
# Installer avhengigheter
pnpm install
(cd ./server && npm install)

# Utvikling (frontend på :3000, krever backend på :8080)
pnpm dev

# Start backend (separat terminal)
(cd ./server && npm start)

# Bygg
pnpm build              # Full bygg (clean + compile + demo + production)
pnpm run build:demo     # Kun demo-bygg
pnpm run build:production # Kun produksjonsbygg

# Test og linting
pnpm test               # Kjør alle tester én gang (vitest run)
pnpm lint               # ESLint på .ts/.tsx-filer

# GraphQL-kodegenerering
pnpm run gql:generate   # Generer TypeScript-typer fra bruker.graphql
```

## Arkitektur og mønstre

### Kommunikasjonsflyt
```
Browser → Express BFF (:8080) → Backend-APIer (Altinn, notifikasjon-api, m.fl.)
```
I utviklingsmodus proxier Vite (:3000) til Express (:8080).

### Autentisering
- **Wonderwall** håndterer innlogging (OAuth2/IDporten)
- **TokenX** brukes for tjenestetoken-utveksling i BFF-en
- `LoginBoundary.tsx` beskytter hele appen klient-side

### State management
Appen bruker utelukkende React Context (ingen Redux/Zustand):
- `OrganisasjonerOgTilgangerContext` – virksomheter og Altinn-tilganger
- `OrganisasjonsDetaljerContext` – valgt virksomhet
- `AlertContext` – systemmeldinger
- `ConsentContext` – brukersamtykke

### Datahenting
- **SWR** for REST-kall (f.eks. Enhetsregisteret)
- **Apollo Client** for GraphQL (notifikasjoner og saker via `bruker.graphql`)
- Zod brukes til runtime-validering av API-responser

### Demo-modus
- Aktiveres med `--mode demo` (Vite) eller `?demoprofil=` query-param
- MSW (Mock Service Worker) intercepter alle API-kall
- Handlers ligger i `src/mocks/handlers/`
- Demo-bygg havner i `build/demo/`

### Analytikk og feilsporing
- **Grafana Faro** (`@grafana/faro-web-sdk`) for feilsporing og telemetri
- Egendefinerte hendelser logges via `src/utils/analytics.ts`
- Lenker med sporing bruker `LenkeMedLogging`-komponenten

## Kodekonvensjoner

- **Komponentfiler**: PascalCase (f.eks. `Saksoversikt.tsx`)
- **Hooks og utilities**: camelCase (f.eks. `useUserInfo.ts`, `dato.ts`)
- **Kontekst**: `*Context.ts` for definisjon, `*Provider.tsx` for provider
- Funksjonelle komponenter med hooks – ingen klassekomponenter
- TypeScript-typer for GraphQL genereres automatisk – ikke rediger `src/api/graphql-types.ts` manuelt
- CSS-moduler brukes noen steder, ellers NAV DS utility-klasser

## Testing

- Testrammeverk: **Vitest** med **happy-dom** som DOM-miljø
- Testfiler legges ved siden av kildefilen eller i `src/tests/`
- Bruk **MSW** for å mocke API-kall i tester
- Tilgjengelighetstester med **jest-axe** (`src/tests/A11y.test.tsx`)
- Kjør `pnpm test` for å verifisere at endringer ikke brekker eksisterende tester

## Miljøvariabler

Konfigurasjon injiseres av Express-serveren i `window.environment` ved oppstart. Det finnes ingen `.env`-filer i repoet – se `server/server.js` og `nais/*.yaml` for relevante variabler (`MILJO`, `PORT`, `LOGIN_URL`, `NAIS_CLUSTER_NAME`, m.fl.).

## Utplassering

Applikasjonen deployes på **NAIS** (NAVs Kubernetes-plattform). Konfigurasjonsfilene i `nais/` dekker fire miljøer: `prod-gcp`, `dev-gcp`, `demo-prodlik` og `demo-devlik`.
