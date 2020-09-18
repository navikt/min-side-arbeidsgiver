import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Arbeidsavtale } from '../../../../api/dnaApi';

export const kunAvsluttedeOgAvbrutte = (avtaler: Arbeidsavtale[]) =>
    avtaler.every(
        arbeidsavtale => arbeidsavtale.status === 'Avsluttet' || arbeidsavtale.status === 'Avbrutt'
    );

const antallAvtalerPerStatus = (avtaler: Arbeidsavtale[], status: string): number =>
    avtaler.filter((arbeidsavtale: Arbeidsavtale) => arbeidsavtale.status === status).length;

export const antallKlareOppstart = (avtaler: Arbeidsavtale[]) =>
    antallAvtalerPerStatus(avtaler, 'Klar for oppstart');

export const antallTilGodkjenning = (avtaler: Arbeidsavtale[]) =>
    antallAvtalerPerStatus(avtaler, 'Mangler godkjenning');

export const antallPabegynt = (avtaler: Arbeidsavtale[]) =>
    antallAvtalerPerStatus(avtaler, 'Påbegynt');

export const antallGjennomfores = (avtaler: Arbeidsavtale[]) =>
    antallAvtalerPerStatus(avtaler, 'Gjennomføres');

export const antallAvbrutte = (avtaler: Arbeidsavtale[]) =>
    antallAvtalerPerStatus(avtaler, 'Avbrutt');

export const antallAvsluttede = (avtaler: Arbeidsavtale[]) =>
    antallAvtalerPerStatus(avtaler, 'Avsluttet');

export const lagTekstBasertPaAntall = (antall: number, typeTekst: string) => {
    if (antall === 0) {
        return;
    } else if (antall === 1) {
        return <Normaltekst>{`1 avtale ${typeTekst}`}</Normaltekst>;
    } else {
        return <Normaltekst>{`${antall} avtaler ${typeTekst}`}</Normaltekst>;
    }
};
