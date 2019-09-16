import { enkelArbeidsforhold } from '../../../../../Objekter/Ansatte';

export const sjekkAntallSider = (liste: enkelArbeidsforhold[], antallForhold: number) => {
    let antallSider: number = Math.floor(liste.length / antallForhold);
    if (liste.length % antallForhold !== 0) {
        antallSider++;
    }
    return antallSider;
};

export const genererListe = (
    indeks: number,
    liste: enkelArbeidsforhold[],
    antallForhold: number
) => {
    return liste.slice(indeks, indeks + antallForhold + 1);
};
