import {SkjemaMedOrganisasjonerMedTilgang} from "../../../api/dnaApi";
import AltinnLenke from "./AltinnLenke/AltinnLenke";
import React from "react";
const navnPaAltinnSkejma = ['Mentortilskudd', 'Inkluderingstilskudd','Ekspertbistand','Lønnstilskudd', 'Inntektsmelding'];

export const finnOgTellTilganger = (altinnTjenester: SkjemaMedOrganisasjonerMedTilgang[], valgtOrganisasjon: string): string [] => {
    const listeMedNavnPaTilganger: string[] = []
    navnPaAltinnSkejma.forEach(skjemaNavn => {
        altinnTjenester.forEach( tjeneste => {
            if (tjeneste.Skjema.navn === skjemaNavn) {
               const harTilgang = sjekkOmTilgangTilAltinnSkjema(valgtOrganisasjon, tjeneste);
               harTilgang && listeMedNavnPaTilganger.push(skjemaNavn);
            }
        })
    })
    return listeMedNavnPaTilganger
}

const sjekkOmTilgangTilAltinnSkjema = (
    orgnr: string,
    skjema: SkjemaMedOrganisasjonerMedTilgang
) => {
    return skjema.OrganisasjonerMedTilgang.filter(org => org.OrganizationNumber === orgnr).length > 0;
};

export const genererAltinnSkjema = (skjemanavn: string, lenke: string, typeAntall: string) => {
    return <AltinnLenke
        className={'altinn-container__' + typeAntall} href={lenke}
        tekst={skjemanavn}
        nyFane={true}
    />
}