import { describe, expect, it } from 'vitest';
import { Notifikasjon, OppgaveTilstand } from '../../../api/graphql-types';
import { filtrerUlesteNotifikasjoner } from './filtrerUlesteNotifikasjoner';
import { beskjed, dateInFuture, dateInPast, oppgave } from '../../../mocks/brukerApi/helpers';
import { fakerNB_NO as faker } from '@faker-js/faker';

describe('filtrerUlesteNotifikasjoner', () => {
    const nå = new Date();
    const tidligere = dateInPast({ hours: 2 });
    const senere = dateInFuture({ hours: 2 });

    const dummyNotifikasjon = () => ({
        tekst: faker.book.title(),
        merkelapp: faker.lorem.word(),
    });

    it('returnerer alle notifikasjoner hvis sistLest er undefined', () => {
        const notifikasjon = beskjed({
            opprettetTidspunkt: nå,
            ...dummyNotifikasjon(),
        });
        const input: Notifikasjon[] = [notifikasjon];
        expect(filtrerUlesteNotifikasjoner(undefined, input)).toEqual(input);
    });

    it('filtrerer ut notifikasjoner eldre enn sistLest', () => {
        const gammelNotifikasjon = beskjed({
            opprettetTidspunkt: tidligere,
            ...dummyNotifikasjon(),
        });
        const nyNotifikasjon = beskjed({
            opprettetTidspunkt: senere,
            ...dummyNotifikasjon(),
        });
        const input: Notifikasjon[] = [gammelNotifikasjon, nyNotifikasjon];
        expect(filtrerUlesteNotifikasjoner(nå.toISOString(), input)).toEqual([nyNotifikasjon]);
    });

    it('filtrerer ut Oppgave-notifikasjoner som ikke er i tilstand "Ny"', () => {
        const utførtNotifikasjon = oppgave({
            opprettetTidspunkt: senere,
            tilstand: OppgaveTilstand.Utfoert,
            ...dummyNotifikasjon(),
        });
        const nyOppgave = oppgave({
            opprettetTidspunkt: senere,
            tilstand: OppgaveTilstand.Ny,
            ...dummyNotifikasjon(),
        });

        const input: Notifikasjon[] = [utførtNotifikasjon, nyOppgave];
        expect(filtrerUlesteNotifikasjoner(tidligere.toISOString(), input)).toEqual([nyOppgave]);
    });

    it('filtrerer korrekt basert på både tidspunkt og tilstand', () => {
        const gammelNy = oppgave({
            tilstand: OppgaveTilstand.Ny,
            opprettetTidspunkt: tidligere,
            ...dummyNotifikasjon(),
        });
        const nyUtført = oppgave({
            tilstand: OppgaveTilstand.Utfoert,
            opprettetTidspunkt: senere,
            ...dummyNotifikasjon(),
        });
        const nyNy = oppgave({
            tilstand: OppgaveTilstand.Ny,
            opprettetTidspunkt: senere,
            ...dummyNotifikasjon(),
        });

        const input: Notifikasjon[] = [nyUtført, gammelNy, nyNy];
        expect(filtrerUlesteNotifikasjoner(nå.toISOString(), input)).toEqual([nyNy]);
    });
});
