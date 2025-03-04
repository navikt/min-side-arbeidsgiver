import { fakerNB_NO as faker } from '@faker-js/faker';
import {
    Beskjed,
    BeskjedTidslinjeElement,
    Kalenderavtale,
    KalenderavtaleTidslinjeElement,
    KalenderavtaleTilstand,
    Lokasjon,
    Oppgave,
    OppgaveFilterInfo, OppgaveFilterType,
    OppgaveTidslinjeElement,
    OppgaveTilstand,
    Sak,
    SakStatus,
    SakStatusType,
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
    lenke = faker.internet.url(),
}: {
    tekst: string;
    opprettetTidspunkt?: Date;
    lenke: string;
}): BeskjedTidslinjeElement => ({
    __typename: 'BeskjedTidslinjeElement',
    id: faker.string.uuid(),
    tekst,
    opprettetTidspunkt: opprettetTidspunkt.toISOString(),
    lenke,
});

export const oppgaveTidslinjeElement = ({
    tilstand = faker.helpers.enumValue(OppgaveTilstand),
    tekst,
    frist,
    opprettetTidspunkt = faker.date.recent(),
    paaminnelseTidspunkt,
    utfoertTidspunkt,
    utgaattTidspunkt,
    lenke = faker.internet.url(),
}: {
    tekst: string;
    tilstand?: OppgaveTilstand;
    frist?: Date;
    opprettetTidspunkt?: Date;
    paaminnelseTidspunkt?: Date;
    utfoertTidspunkt?: Date;
    utgaattTidspunkt?: Date;
    lenke: string;
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
    lenke,
});

export const kalenderavtaleTidslinjeElement = ({
    tekst,
    avtaletilstand = faker.helpers.enumValue(KalenderavtaleTilstand),
    startTidspunkt = faker.date.recent(),
    digitalt = false,
    lokasjon,
    sluttTidspunkt,
    lenke = faker.internet.url(),
}: {
    tekst: string;
    avtaletilstand?: KalenderavtaleTilstand;
    digitalt?: boolean;
    lokasjon?: Lokasjon;
    sluttTidspunkt?: Date;
    startTidspunkt?: Date;
    lenke: string;
}): KalenderavtaleTidslinjeElement => ({
    __typename: 'KalenderavtaleTidslinjeElement',
    id: faker.string.uuid(),
    tekst,
    avtaletilstand,
    digitalt,
    lokasjon,
    startTidspunkt: startTidspunkt.toISOString(),
    sluttTidspunkt: sluttTidspunkt?.toISOString(),
    lenke,
});

export const oppgaveFilterInfo = (saker: Sak[]): Array<OppgaveFilterInfo> => {
    const group = Object.groupBy(
        saker
            .flatMap((sak) => sak.tidslinje)
            .filter((tidslinjeElement) => tidslinjeElement.__typename === 'OppgaveTidslinjeElement')
            .map((tids) => tids as OppgaveTidslinjeElement),
        (entry: OppgaveTidslinjeElement) => entry.tilstand
    );

    return [
        ...Object.entries(group).map(([tilstand, oppgaver]) => ({
            filterType: mapOppgaveTilstandTilFilterType(tilstand),
            antall: oppgaver.length,
        })),
        {
            filterType: OppgaveFilterType.Values.TILSTAND_NY_MED_PAAMINNELSE_UTLOEST,
            antall: group.NY?.filter(o => o.paaminnelseTidspunkt !== null && o.paaminnelseTidspunkt !== undefined).length ?? 0,
        },
    ];
};

export const mapOppgaveTilstandTilFilterType = (tilstand: string): OppgaveFilterType => {
    console.log(tilstand)
    switch (tilstand) {
        case OppgaveTilstand.Ny:
            return OppgaveFilterType.Values.TILSTAND_NY;
        case OppgaveTilstand.Utfoert:
            return OppgaveFilterType.Values.TILSTAND_UTFOERT;
        case OppgaveTilstand.Utgaatt:
            return OppgaveFilterType.Values.TILSTAND_UTGAATT;
        default:
            throw new Error(`Ukjent tilstand: ${tilstand}`);
    }
}

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
    lenke = faker.internet.url(),
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

    frist: frist,
    opprettetTidspunkt: opprettetTidspunkt,
    paaminnelseTidspunkt: paaminnelseTidspunkt,
    utfoertTidspunkt: utfoertTidspunkt,
    utgaattTidspunkt: utgaattTidspunkt,
    sorteringTidspunkt: opprettetTidspunkt,

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
    lenke = faker.internet.url(),
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

    opprettetTidspunkt: opprettetTidspunkt,
    sorteringTidspunkt: opprettetTidspunkt,

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
    startTidspunkt: startTidspunkt,
    sluttTidspunkt: sluttTidspunkt,
    paaminnelseTidspunkt: paaminnelseTidspunkt,
    opprettetTidspunkt: opprettetTidspunkt,
    sorteringTidspunkt: opprettetTidspunkt,

    brukerKlikk: {
        __typename: 'BrukerKlikk',
        id: faker.string.uuid(),
        klikketPaa,
    },

    lenke: faker.internet.url(),
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
    lenke = faker.internet.url(),
}: {
    merkelapp?: Merkelapp;
    nesteSteg?: string;
    sisteStatus: SakStatus;
    tidslinje: TidslinjeElement[];
    tilleggsinformasjon?: string;
    tittel: string;
    virksomhet: Virksomhet;
    lenke?: string | null;
}): Sak => ({
    id: faker.string.uuid(),
    tittel,
    lenke,
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
