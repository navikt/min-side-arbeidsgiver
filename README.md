# Frontend for Min side – arbeidsgiver 

Min side – arbeidsgiver er en samleside for digitale tjenester for arbeidsgivere som Nav har laget. Hensikten med siden er å gjøre det enklere for arbeidsgivere å finne frem til tjenster de har tilgang til.

## Komme i gang

Min side – Arbeidsgiver har mange integrasjoner, ved lokal kjøring mocker vi alle i express-serveren

- Installere avhengigheter: `npm`
- Kjøre applikasjon med mock: 
  1. `npm start`
- Notifikasjoner vil blir forsøkt hentet via proxy til localhost:8081.
  Enten kjør notifikasjon-bruker-api lokalt, eller start apollo mock server med: `cd server && npm run start:apollo`
- Bygge applikasjonen: `npm run build`
- Kjøre applikasjonen med Node-backend (uten mocking). Dette fungerer ikke ut av boksen, du må endre `server/server.js` til å proxye/mocke riktig. For å kjøre applikasjonen:
    1. `npm && npm run build`
    2. `cd server`
    3. `npm i && npm start`
- Kjøre applikasjonen med Docker:
    1. `npm && npm run build`
    2. `npm run docker:build`
    3. `npm run docker:start`
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