import { Notifikasjon, OppgaveTilstand } from '../../../api/graphql-types';

export const uleste = (
    sistLest: string | undefined,
    notifikasjoner: Notifikasjon[]
): Notifikasjon[] => {
    if (sistLest === undefined) return notifikasjoner;

    const sistLestTid = Date.parse(sistLest);

    return notifikasjoner.filter((notifikasjon) => {
        if (
            notifikasjon.__typename === 'Oppgave' &&
            notifikasjon.tilstand !== OppgaveTilstand.Ny
        ) {
            return false;
        }
        return Date.parse(notifikasjon.sorteringTidspunkt) > sistLestTid;
    });
};