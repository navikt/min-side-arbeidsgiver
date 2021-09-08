# Frontend for Min side – arbeidsgiver 

Min side – arbeidsgiver er en samleside for digitale tjenester for arbeidsgivere som Nav har laget. Hensikten med siden er å gjøre det enklere for arbeidsgivere å finne frem til tjenster de har tilgang til.

## Komme i gang

Min side – Arbeidsgiver har mange integrasjoner, ved lokal kjøring mocker vi alle sammen med fetchmock

- Installere avhengigheter: `yarn`
- Kjøre applikasjonen normalt: `yarn start` (NB! Krever at backend kjører på port 8080)
- Kjøre applikasjon med mock: `yarn start:mock` eller `yarn start:mock:win` på windows
- Notifikasjoner vil blir forsøkt hentet via proxy til localhost:8081
  Enten kjør produsent-api lokalt, eller start apollo mock server med: `yarn start:apollo`
- Bygge applikasjonen: `yarn build`
- Kjøre applikasjonen med Node-backend:
    1. `yarn && yarn build`
    2. `cd server`
    3. `npm i && npm start`
- Kjøre applikasjonen med Docker:
    1. `yarn && yarn build`
    2. `yarn docker:build`
    3. `yarn docker:start`
    4. For å stoppe, kjør `docker stop <id>` med id-en fra forrige kommando



---

## Henvendelser
Spørsmål knyttet til koden eller prosjektet kan opprettes som github issues.
Eller for genereller spørsmål sjekk commit log for personer som aktivt jobber med koden.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #arbeidsgiver-min-side-arbeidsgiver.

### Lenker til applikasjon

dev:  https://min-side-arbeidsgiver.dev.nav.no/min-side-arbeidsgiver (i vdi, eller over vpn)
prod: https://arbeidsgiver.nav.no/min-side-arbeidsgiver/
labs: https://arbeidsgiver.labs.nais.io/min-side-arbeidsgiver/
logs: https://logs.adeo.no/app/dashboards#/view/754c72d0-76d8-11eb-90cb-7315dfb7dea6