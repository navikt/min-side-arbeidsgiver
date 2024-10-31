import { KalenderavtaleTilstand } from '../../api/graphql-types';
import { fakerNB_NO as faker } from '@faker-js/faker';
import { dateInFuture, kalenderavtale } from './helpers';

export const alleKalenderavtaler = [
    kalenderavtale({
        tekst: `Dialogmøte ${faker.person.fullName()}`,
        startTidspunkt: dateInFuture({ days: 1 }),
        sluttTidspunkt: dateInFuture({ days: 1, hours: 1 }),
        avtaletilstand: KalenderavtaleTilstand.VenterSvarFraArbeidsgiver,
        lokasjon: {
            adresse: faker.location.streetAddress(),
            postnummer: faker.location.zipCode('####'),
            poststed: faker.location.city(),
        },
        digitalt: false,
        merkelapp: 'Dialogmøte',
    }),
    kalenderavtale({
        tekst: `Dialogmøte ${faker.person.fullName()}`,
        startTidspunkt: dateInFuture({ days: 3 }),
        avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverHarGodtatt,
        digitalt: true,
        merkelapp: 'Dialogmøte',
    }),
    kalenderavtale({
        tekst: `Dialogmøte ${faker.person.fullName()}`,
        startTidspunkt: dateInFuture({ days: 7 }),
        sluttTidspunkt: dateInFuture({ days: 7, hours: 1 }),
        avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverVilEndreTidEllerSted,
        lokasjon: {
            adresse: faker.location.streetAddress(),
            postnummer: faker.location.zipCode('####'),
            poststed: faker.location.city(),
        },
        digitalt: false,
        merkelapp: 'Dialogmøte',
    }),
    kalenderavtale({
        tekst: `Dialogmøte ${faker.person.fullName()}`,
        startTidspunkt: dateInFuture({ days: 10 }),
        avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverVilAvlyse,
        merkelapp: 'Dialogmøte',
    }),
    kalenderavtale({
        tekst: `Dialogmøte ${faker.person.fullName()}`,
        startTidspunkt: dateInFuture({ months: 1 }),
        sluttTidspunkt: dateInFuture({ months: 1, hours: 3 }),
        avtaletilstand: KalenderavtaleTilstand.Avlyst,
        digitalt: true,
        merkelapp: 'Dialogmøte',
    }),
];
