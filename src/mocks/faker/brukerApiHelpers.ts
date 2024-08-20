import { fakerNB_NO as faker } from '@faker-js/faker';
import {
    BeskjedTidslinjeElement,
    KalenderavtaleTidslinjeElement,
    KalenderavtaleTilstand,
    Lokasjon,
    OppgaveTidslinjeElement,
    OppgaveTilstand,
    OppgaveTilstandInfo,
    SakStatus,
    SakStatusType,
    Virksomhet,
} from '../../api/graphql-types';
import { altinnskjema, altinntjeneste } from '../../altinn/tjenester';
import * as Record from '../../utils/Record';

export const orgnr = () => faker.number.int({ min: 100000000, max: 999999999 }).toString();

export const virksomhet = ({
    navn = faker.company.name(),
    virksomhetsnummer = orgnr(),
} = {}): Virksomhet => ({
    __typename: 'Virksomhet',
    navn,
    virksomhetsnummer,
});

export const alleMerkelapper = [
    'Arbeidstrening',
    'Fritak i arbeidsgiverperioden',
    'Inntektsmelding',
    'Inntektsmelding sykepenger',
    'Inntektsmelding pleiepenger',
    'Lønnstilskudd',
    'Masseoppsigelse',
    'Mentor',
    'Permittering',
    'Sommerjobb',
    'Yrkesskade',
    'Dialogmøte',
];

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

export const alleTilganger = Record.mapToArray(
    altinntjeneste,
    (id, { tjenestekode, tjenesteversjon }) => ({
        id,
        tjenestekode,
        tjenesteversjon,
    })
);
