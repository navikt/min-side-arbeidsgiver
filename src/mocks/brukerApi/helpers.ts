import { fakerNB_NO as faker } from '@faker-js/faker';
import {
    Beskjed,
    BeskjedTidslinjeElement,
    Kalenderavtale,
    KalenderavtaleTidslinjeElement,
    KalenderavtaleTilstand,
    Lokasjon,
    Maybe,
    Oppgave,
    OppgaveMetadata,
    OppgaveTidslinjeElement,
    OppgaveTilstand,
    OppgaveTilstandInfo,
    Sak,
    SakStatus,
    SakStatusType,
    Scalars,
    TidslinjeElement,
    Virksomhet,
} from '../../api/graphql-types';
import { buildASTSchema, graphql as executeGraphQL } from 'graphql';
import Document from '../../../bruker.graphql';
import { GraphQLVariables } from 'msw';
import { alleMerkelapper, Merkelapp } from './alleMerkelapper';

export const orgnr = () => faker.number.int({ min: 100000000, max: 999999999 }).toString();

export const fakeName = () => `${faker.person.firstName()} ${faker.vehicle.vehicle()}`;

export const fdato = () => {
    const date = faker.date.birthdate();
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

export const virksomhet = ({
    navn = faker.company.name(),
    virksomhetsnummer = orgnr(),
} = {}): Virksomhet => ({
    __typename: 'Virksomhet',
    navn,
    virksomhetsnummer,
});

export const merkelapp = () => {
    return faker.helpers.arrayElement(alleMerkelapper);
};

export const sakStatus = ({
    type = faker.helpers.enumValue(SakStatusType),
    tidspunkt = faker.date.recent(),
    tekst,
}: {
    type?: SakStatusType;
    tidspunkt?: Date;
    tekst: string;
}): SakStatus => ({
    type,
    tekst,
    tidspunkt: tidspunkt.toISOString(),
});

export const beskjedTidslinjeElement = ({
    tekst,
    opprettetTidspunkt = faker.date.recent(),
}: {
    tekst: string;
    opprettetTidspunkt?: Date;
}): BeskjedTidslinjeElement => ({
    __typename: 'BeskjedTidslinjeElement',
    id: faker.string.uuid(),
    tekst,
    opprettetTidspunkt: opprettetTidspunkt.toISOString(),
});

export const oppgaveTidslinjeElement = ({
    tilstand = faker.helpers.enumValue(OppgaveTilstand),
    tekst,
    frist,
    opprettetTidspunkt = faker.date.recent(),
    paaminnelseTidspunkt,
    utfoertTidspunkt,
    utgaattTidspunkt,
}: {
    tekst: string;
    tilstand?: OppgaveTilstand;
    frist?: Date;
    opprettetTidspunkt?: Date;
    paaminnelseTidspunkt?: Date;
    utfoertTidspunkt?: Date;
    utgaattTidspunkt?: Date;
}): OppgaveTidslinjeElement => ({
    __typename: 'OppgaveTidslinjeElement',
    id: faker.string.uuid(),
    tekst,
    opprettetTidspunkt: opprettetTidspunkt.toISOString(),
    paaminnelseTidspunkt: paaminnelseTidspunkt?.toISOString(),
    utfoertTidspunkt: utfoertTidspunkt?.toISOString(),
    utgaattTidspunkt: utgaattTidspunkt?.toISOString(),
    frist,
    tilstand,
});

export const kalenderavtaleTidslinjeElement = ({
    tekst,
    avtaletilstand = faker.helpers.enumValue(KalenderavtaleTilstand),
    startTidspunkt = faker.date.recent(),
    digitalt = false,
    lokasjon,
    sluttTidspunkt,
}: {
    tekst: string;
    avtaletilstand?: KalenderavtaleTilstand;
    digitalt?: boolean;
    lokasjon?: Lokasjon;
    sluttTidspunkt?: Date;
    startTidspunkt?: Date;
}): KalenderavtaleTidslinjeElement => ({
    __typename: 'KalenderavtaleTidslinjeElement',
    id: faker.string.uuid(),
    tekst,
    avtaletilstand,
    digitalt,
    lokasjon,
    startTidspunkt: startTidspunkt.toISOString(),
    sluttTidspunkt: sluttTidspunkt?.toISOString(),
});

export const oppgaveTilstandInfo = (): Array<OppgaveTilstandInfo> =>
    Object.values(OppgaveTilstand).map((tilstand) => ({
        tilstand,
        antall: faker.number.int(100),
    }));

export const oppgave = ({
    tilstand = faker.helpers.enumValue(OppgaveTilstand),
    tekst,
    frist,
    sakTittel,
    opprettetTidspunkt = faker.date.recent(),
    paaminnelseTidspunkt,
    utfoertTidspunkt,
    utgaattTidspunkt,
    klikketPaa = true,
    tilleggsinformasjon,
    lenke = `#${faker.lorem.word()}`,
}: {
    tekst: string;
    tilstand?: OppgaveTilstand;
    frist?: Date;
    sakTittel?: string;
    opprettetTidspunkt?: Date;
    paaminnelseTidspunkt?: Date;
    utfoertTidspunkt?: Date;
    utgaattTidspunkt?: Date;
    klikketPaa?: boolean;
    tilleggsinformasjon?: string;
    lenke?: string;
}): Oppgave => ({
    __typename: 'Oppgave',
    id: faker.string.uuid(),
    tekst,
    tilstand,

    frist: frist?.toISOString(),
    opprettetTidspunkt: opprettetTidspunkt.toISOString(),
    paaminnelseTidspunkt: paaminnelseTidspunkt?.toISOString(),
    utfoertTidspunkt: utfoertTidspunkt?.toISOString(),
    utgaattTidspunkt: utgaattTidspunkt?.toISOString(),
    sorteringTidspunkt: opprettetTidspunkt.toISOString(),

    brukerKlikk: {
        __typename: 'BrukerKlikk',
        id: faker.string.uuid(),
        klikketPaa,
    },

    lenke: lenke,
    merkelapp: merkelapp(),

    sak:
        sakTittel !== undefined
            ? {
                  __typename: 'SakMetadata',
                  tittel: sakTittel,
                  tilleggsinformasjon: tilleggsinformasjon,
              }
            : undefined,
    virksomhet: virksomhet(),
});

export const beskjed = ({
    tekst,
    sakTittel,
    opprettetTidspunkt = faker.date.recent(),
    klikketPaa = true,
    tilleggsinformasjon,
    lenke = `#${faker.lorem.word()}`,
}: {
    tekst: string;
    sakTittel?: string;
    opprettetTidspunkt?: Date;
    klikketPaa?: boolean;
    tilleggsinformasjon?: string;
    lenke?: string;
}): Beskjed => ({
    __typename: 'Beskjed',
    id: faker.string.uuid(),
    tekst,

    opprettetTidspunkt: opprettetTidspunkt.toISOString(),
    sorteringTidspunkt: opprettetTidspunkt.toISOString(),

    brukerKlikk: {
        __typename: 'BrukerKlikk',
        id: faker.string.uuid(),
        klikketPaa,
    },

    lenke: lenke,
    merkelapp: merkelapp(),

    sak:
        sakTittel !== undefined
            ? {
                  __typename: 'SakMetadata',
                  tittel: sakTittel,
                  tilleggsinformasjon: tilleggsinformasjon,
              }
            : undefined,
    virksomhet: virksomhet(),
});

export const kalenderavtale = ({
    tekst,
    sakTittel,
    klikketPaa = true,
    avtaletilstand = faker.helpers.enumValue(KalenderavtaleTilstand),
    startTidspunkt = faker.date.recent(),
    sluttTidspunkt,
    digitalt = false,
    lokasjon,
    paaminnelseTidspunkt,
    opprettetTidspunkt = faker.date.recent(),
    merkelapp: _merkelapp = merkelapp(),
    tilleggsinformasjon,
}: {
    tekst: string;
    sakTittel?: string;
    klikketPaa?: boolean;
    avtaletilstand?: KalenderavtaleTilstand;
    digitalt?: boolean;
    lokasjon?: Lokasjon;
    sluttTidspunkt?: Date;
    startTidspunkt?: Date;
    paaminnelseTidspunkt?: Date;
    opprettetTidspunkt?: Date;
    tilleggsinformasjon?: string;
    merkelapp?: string;
}): Kalenderavtale => ({
    __typename: 'Kalenderavtale',

    id: faker.string.uuid(),
    tekst,

    avtaletilstand,
    digitalt,
    lokasjon,
    startTidspunkt: startTidspunkt.toISOString(),
    sluttTidspunkt: sluttTidspunkt?.toISOString(),
    paaminnelseTidspunkt: paaminnelseTidspunkt?.toISOString(),
    opprettetTidspunkt: opprettetTidspunkt.toISOString(),
    sorteringTidspunkt: opprettetTidspunkt.toISOString(),

    brukerKlikk: {
        __typename: 'BrukerKlikk',
        id: faker.string.uuid(),
        klikketPaa,
    },

    lenke: `#${faker.lorem.word()}`,
    merkelapp: _merkelapp,

    sak:
        sakTittel !== undefined
            ? {
                  __typename: 'SakMetadata',
                  tittel: sakTittel,
                  tilleggsinformasjon: tilleggsinformasjon,
              }
            : undefined,
    virksomhet: virksomhet(),
});

export const sak = ({
    tittel,
    merkelapp: _merkelapp = merkelapp(),
    nesteSteg,
    sisteStatus,
    tidslinje,
    tilleggsinformasjon,
    virksomhet,
}: {
    merkelapp?: Merkelapp;
    nesteSteg?: string;
    sisteStatus: SakStatus;
    tidslinje: TidslinjeElement[];
    tilleggsinformasjon?: string;
    tittel: string;
    virksomhet: Virksomhet;
}): Sak => ({
    id: faker.string.uuid(),
    tittel,
    lenke: `#${faker.lorem.word()}`,
    merkelapp: _merkelapp,
    nesteSteg,
    sisteStatus,
    tidslinje,
    tilleggsinformasjon,
    virksomhet,
    frister: [],
    oppgaver: [],
});

export const schema = buildASTSchema(Document);

export const executeAndValidate = ({
    query,
    variables,
    rootValue,
}: {
    query: string;
    variables: GraphQLVariables;
    rootValue: unknown;
}) =>
    executeGraphQL({
        schema,
        source: query,
        variableValues: variables,
        rootValue,
    });

export const dateInPast = ({ hours = 0, days = 0, years = 0, months = 0 }) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(date.getHours() - hours);
    date.setFullYear(date.getFullYear() - years);
    date.setMonth(date.getMonth() - months);
    return date;
};

export const dateInFuture = ({ hours = 0, days = 0, years = 0, months = 0 }) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    return date;
};
