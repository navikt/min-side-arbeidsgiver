import {
    KalenderavtaleTilstand,
    Notifikasjon,
    Oppgave,
    OppgaveTilstand,
} from '../../../api/graphql-types';
import React, { FC, KeyboardEvent, ReactNode } from 'react';
import NotifikasjonElement from './NotifikasjonElement';
import {
    BeskjedIkon,
    KalenderavtaleIkon,
    NyOppgaveIkon,
    OppgaveUtfortIkon,
    OppgaveUtgaattIkon,
} from '../../Saksoversikt/OppgaveBeskjedIkoner';
import { Tag } from '@navikt/ds-react';
import { formatterDato, kalenderavtaleTidspunkt, uformellDatotekst } from '../../../utils/dato';
import { StopWatch } from '@navikt/ds-icons';

interface NotifikasjonListeElementProps {
    notifikasjon: Notifikasjon;
    onKeyDown: (e: KeyboardEvent<HTMLAnchorElement>, id: string) => void;
    onFocus: () => void;
    isFocused: boolean;
    handleKlikk: () => void;
}

const NotifikasjonListeElement = (props: NotifikasjonListeElementProps) => {
    const notifikasjon = props.notifikasjon;
    switch (notifikasjon.__typename) {
        case 'Beskjed':
            return (
                <NotifikasjonElement
                    erTodo={false}
                    ikon={<BeskjedIkon title="Beskjed" aria-hidden />}
                    tittel={notifikasjon.tekst}
                    visningstidspunkt={new Date(notifikasjon.opprettetTidspunkt)}
                    {...props}
                />
            );

        case 'Oppgave':
            const tilstand = notifikasjon.tilstand;
            switch (tilstand) {
                case OppgaveTilstand.Ny:
                    return (
                        <NotifikasjonElement
                            erTodo={true}
                            ikon={<NyOppgaveIkon title="Uløst oppgave" />}
                            tittel={notifikasjon.tekst}
                            visningstidspunkt={new Date(notifikasjon.opprettetTidspunkt)}
                            statuslinje={<StatuslinjeOppgaveNy notifikasjon={notifikasjon} />}
                            {...props}
                        />
                    );
                case OppgaveTilstand.Utfoert:
                    return (
                        <NotifikasjonElement
                            erTodo={false}
                            ikon={<OppgaveUtfortIkon title="Utført oppgave" />}
                            tittel={notifikasjon.tekst}
                            statuslinje={
                                <Tag size="small" variant="success">
                                    Utført{' '}
                                    {notifikasjon.utfoertTidspunkt !== '' &&
                                        uformellDatotekst(new Date(notifikasjon.utfoertTidspunkt))}
                                </Tag>
                            }
                            {...props}
                        />
                    );
                case OppgaveTilstand.Utgaatt:
                    return (
                        <NotifikasjonElement
                            erTodo={false}
                            ikon={<OppgaveUtgaattIkon title="Utgått oppgave" />}
                            tittel={notifikasjon.tekst}
                            visningstidspunkt={new Date(notifikasjon.opprettetTidspunkt)}
                            statuslinje={
                                notifikasjon.frist !== null ? (
                                    <StatusIkonMedTekst variant="neutral">
                                        Fristen gikk ut{' '}
                                        {uformellDatotekst(new Date(notifikasjon.utgaattTidspunkt))}
                                    </StatusIkonMedTekst>
                                ) : (
                                    <Tag size="small" variant="neutral">
                                        Utgått{' '}
                                        {uformellDatotekst(new Date(notifikasjon.utgaattTidspunkt))}
                                    </Tag>
                                )
                            }
                            {...props}
                        />
                    );
                default:
                    console.error(`ukjent oppgavetilstand ${tilstand}: ignorerer`);
                    return null;
            }
        case 'Kalenderavtale':
            const avtaletilstand = notifikasjon.avtaletilstand;
            const harPassert = new Date(notifikasjon.startTidspunkt) < new Date();
            const tidpunktFormatert = kalenderavtaleTidspunkt(notifikasjon);
            switch (avtaletilstand) {
                case KalenderavtaleTilstand.VenterSvarFraArbeidsgiver:
                    return (
                        <NotifikasjonElement
                            erTodo={!harPassert}
                            ikon={
                                harPassert ? (
                                    <KalenderavtaleIkon
                                        variant="grå"
                                        title={'Kalenderavtale som har passert.'}
                                    />
                                ) : (
                                    <KalenderavtaleIkon
                                        variant="oransje"
                                        title={'Kalenderavtale som du må svare på.'}
                                    />
                                )
                            }
                            tittel={notifikasjon.tekst}
                            undertittel={tidpunktFormatert}
                            statuslinje={
                                harPassert ? undefined : (
                                    <Tag size="small" variant="warning">
                                        Svar på invitasjonen
                                    </Tag>
                                )
                            }
                            {...props}
                        />
                    );
                case KalenderavtaleTilstand.ArbeidsgiverHarGodtatt:
                    return (
                        <NotifikasjonElement
                            erTodo={false}
                            ikon={
                                <KalenderavtaleIkon
                                    variant={harPassert ? 'grå' : 'blå'}
                                    title={'Kalenderavtale som du har svart på.'}
                                />
                            }
                            tittel={notifikasjon.tekst}
                            undertittel={tidpunktFormatert}
                            statuslinje={
                                <Tag size="small" variant="success">
                                    Du har takket ja
                                </Tag>
                            }
                            {...props}
                        />
                    );
                case KalenderavtaleTilstand.ArbeidsgiverVilEndreTidEllerSted:
                    return (
                        <NotifikasjonElement
                            erTodo={false}
                            ikon={
                                <KalenderavtaleIkon
                                    variant={harPassert ? 'grå' : 'blå'}
                                    title={'Kalenderavtale som du har svart på.'}
                                />
                            }
                            tittel={notifikasjon.tekst}
                            undertittel={tidpunktFormatert}
                            statuslinje={
                                <Tag size="small" variant="info">
                                    Du ønsker endre tid eller sted
                                </Tag>
                            }
                            {...props}
                        />
                    );
                case KalenderavtaleTilstand.ArbeidsgiverVilAvlyse:
                    return (
                        <NotifikasjonElement
                            erTodo={false}
                            ikon={
                                <KalenderavtaleIkon
                                    variant={harPassert ? 'grå' : 'blå'}
                                    title={'Kalenderavtale som du har svart på.'}
                                />
                            }
                            tittel={notifikasjon.tekst}
                            undertittel={tidpunktFormatert}
                            statuslinje={
                                <Tag size="small" variant="info">
                                    Du ønsker å avlyse
                                </Tag>
                            }
                            {...props}
                        />
                    );
                case KalenderavtaleTilstand.Avlyst:
                    return (
                        <NotifikasjonElement
                            erTodo={false}
                            ikon={
                                <KalenderavtaleIkon
                                    variant="grå"
                                    title="Kalenderavtale som er avlyst."
                                />
                            }
                            tittel={notifikasjon.tekst}
                            undertittel={tidpunktFormatert}
                            statuslinje={
                                <Tag size="small" variant="error">
                                    Avlyst
                                </Tag>
                            }
                            {...props}
                        />
                    );
                case KalenderavtaleTilstand.Avholdt:
                    return (
                        <NotifikasjonElement
                            erTodo={false}
                            ikon={
                                <KalenderavtaleIkon
                                    variant="grå"
                                    title="Kalenderavtale som er avholdt."
                                />
                            }
                            tittel={notifikasjon.tekst}
                            undertittel={tidpunktFormatert}
                            statuslinje={
                                <Tag size="small" variant="success">
                                    Avholdt
                                </Tag>
                            }
                            {...props}
                        />
                    );
                default:
                    console.error(`ukjent avtaletilstand ${avtaletilstand}: ignorerer`);
                    return null;
            }
        default:
            console.error(`ukjent notifikasjonstype ${notifikasjon.__typename}: ignorerer`);
            return null;
    }
};

const StatuslinjeOppgaveNy = ({ notifikasjon }: { notifikasjon: Oppgave }) => {
    const { frist, paaminnelseTidspunkt } = notifikasjon;

    if (frist === null && paaminnelseTidspunkt === null) return null;

    const harFrist = frist !== null && frist !== '';
    const harPaaminnelse = paaminnelseTidspunkt !== null && paaminnelseTidspunkt !== '';

    if (!harFrist && !harPaaminnelse) return null;

    const fristTekst = harFrist ? `Frist ${formatterDato(new Date(frist))}` : '';
    const tekst = harPaaminnelse
        ? harFrist
            ? `Påminnelse – ${fristTekst}`
            : 'Påminnelse'
        : fristTekst;

    return <StatusIkonMedTekst variant="warning">{tekst}</StatusIkonMedTekst>;
};

const StatusIkonMedTekst: FC<{
    children: ReactNode;
    variant: 'success' | 'neutral' | 'warning';
}> = ({ variant, children }) => (
    <Tag size="small" variant={variant}>
        <span>
            <StopWatch aria-hidden /> {children}
        </span>
    </Tag>
);

export default NotifikasjonListeElement;
