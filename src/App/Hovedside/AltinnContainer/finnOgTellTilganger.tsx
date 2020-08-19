import React from 'react';
import { SkjemaMedOrganisasjonerMedTilgang } from '../../../api/dnaApi';
import AltinnLenke from './AltinnLenke/AltinnLenke';

const navnPaAltinnSkejma = [
    'Mentortilskudd',
    'Inkluderingstilskudd',
    'Ekspertbistand',
    'Lønnstilskudd',
    'Inntektsmelding',
];

export const finnOgTellTilganger = (
    altinnTjenester: SkjemaMedOrganisasjonerMedTilgang[],
    valgtOrganisasjon: string
): string[] => {
    const listeMedNavnPaTilganger: string[] = [];
    navnPaAltinnSkejma.forEach(skjemaNavn => {
        altinnTjenester.forEach(tjeneste => {
            if (tjeneste.Skjema.navn === skjemaNavn) {
                const harTilgang = sjekkOmTilgangTilAltinnSkjema(valgtOrganisasjon, tjeneste);
                harTilgang && listeMedNavnPaTilganger.push(skjemaNavn);
            }
        });
    });
    return listeMedNavnPaTilganger;
};

const sjekkOmTilgangTilAltinnSkjema = (
    orgnr: string,
    skjema: SkjemaMedOrganisasjonerMedTilgang
) => {
    return (
        skjema.OrganisasjonerMedTilgang.filter(org => org.OrganizationNumber === orgnr).length > 0
    );
};

export const genererAltinnSkjema = (skjemanavn: string, lenke: string) => {
    return <AltinnLenke key={skjemanavn} className="altinn-lenke" href={lenke} tekst={skjemanavn} nyFane={true} />;
};
