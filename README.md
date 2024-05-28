# Frontend for Min side – arbeidsgiver 

Min side – arbeidsgiver er en samleside for digitale tjenester for arbeidsgivere som Nav har laget. Hensikten med siden er å gjøre det enklere for arbeidsgivere å finne frem til tjenster de har tilgang til.

## Komme i gang

Min side – Arbeidsgiver har mange integrasjoner, ved lokal kjøring mocker vi alle i express-serveren

- Installere avhengigheter i hovedmappen og i `./server/`: 
```bash
npm install
(cd ./server/ && npm install)
```
- Start frontend-for-backend-serveren
```bash
(cd ./server/ && npm start)
```
- Start frontend
```bash
npm start
```

## Bygge frontend
```bash
npm install
npm run build
```
---

## Henvendelser
Spørsmål knyttet til koden eller prosjektet kan opprettes som github issues.
Eller for genereller spørsmål sjekk commit log for personer som aktivt jobber med koden.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #arbeidsgiver-min-side-arbeidsgiver.

### Lenker til applikasjon

| miljø         | url                                                                            |
|---------------|--------------------------------------------------------------------------------|
| dev           | https://arbeidsgiver.intern.dev.nav.no/min-side-arbeidsgiver (med naisdevice)  |
| prod          | https://arbeidsgiver.nav.no/min-side-arbeidsgiver/                             |
| dev-lik-demo  | https://arbeidsgiver-dev-like.ekstern.dev.nav.no/min-side-arbeidsgiver         |
| prod-lik-demo | https://arbeidsgiver.ekstern.dev.nav.no/min-side-arbeidsgiver                  |
| logs          | https://logs.adeo.no/app/dashboards#/view/754c72d0-76d8-11eb-90cb-7315dfb7dea6 |