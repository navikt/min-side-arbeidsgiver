import {
    BeskjedTidslinjeElement,
    KalenderavtaleTidslinjeElement,
    Notifikasjon,
    OppgaveTidslinjeElement,
    Sak,
    TidslinjeElement,
} from '../../api/graphql-types';
import {
    beskjed,
    kalenderavtale,
    KalenderavtaleTidslinjeElementMedOpprettetTidspunkt,
    oppgave,
} from './helpers';
import { alleSaker } from './alleSaker';

export const alleNotifikasjoner = alleSaker.flatMap((sak) =>
    sak.tidslinje.map((te) => tilNotifikasjon(te, sak))
);

export function tilOppgave(tidslinjeElement: OppgaveTidslinjeElement, sak: Sak) {
    return oppgave({
        tekst: tidslinjeElement.tekst,
        tilstand: tidslinjeElement.tilstand,
        sakTittel: sak.tittel,
        lenke: tidslinjeElement.lenke,
        utfoertTidspunkt: tidslinjeElement.utfoertTidspunkt,
        utgaattTidspunkt: tidslinjeElement.utfoertTidspunkt,
        tilleggsinformasjon: sak.tilleggsinformasjon!,
        opprettetTidspunkt: tidslinjeElement.opprettetTidspunkt,
        frist: tidslinjeElement.frist,
        paaminnelseTidspunkt: tidslinjeElement.paaminnelseTidspunkt,
        klikketPaa: false,
        merkelapp: sak.merkelapp,
    });
}

export function tilBeskjed(tidslinjeElement: BeskjedTidslinjeElement, sak: Sak) {
    return beskjed({
        tekst: tidslinjeElement.tekst,
        sakTittel: sak.tittel,
        klikketPaa: false,
        lenke: tidslinjeElement.lenke,
        opprettetTidspunkt: tidslinjeElement.opprettetTidspunkt,
        tilleggsinformasjon: sak.tilleggsinformasjon!,
        merkelapp: sak.merkelapp,
    });
}

export function tilKalenderAvtale(
    tidslinjeElement: KalenderavtaleTidslinjeElementMedOpprettetTidspunkt,
    sak: Sak
) {
    return kalenderavtale({
        tekst: tidslinjeElement.tekst,
        startTidspunkt: new Date(tidslinjeElement.startTidspunkt),
        opprettetTidspunkt: tidslinjeElement.opprettetTidspunkt,
        lokasjon: tidslinjeElement.lokasjon!,
        digitalt: tidslinjeElement.digitalt!,
        avtaletilstand: tidslinjeElement.avtaletilstand,
        sakTittel: sak.tittel,
        klikketPaa: false,
        merkelapp: sak.merkelapp,
    });
}

export function tilNotifikasjon(tidslinjeElement: TidslinjeElement, sak: Sak): Notifikasjon {
    switch (tidslinjeElement.__typename) {
        case 'OppgaveTidslinjeElement':
            return tilOppgave(tidslinjeElement, sak);
        case 'BeskjedTidslinjeElement':
            return tilBeskjed(tidslinjeElement, sak);
        case 'KalenderavtaleTidslinjeElement':
            return tilKalenderAvtale(
                tidslinjeElement as KalenderavtaleTidslinjeElementMedOpprettetTidspunkt,
                sak
            );
        default:
            throw new Error(`Ukjent tidslinje-element: ${tidslinjeElement}`);
    }
}
