import React, { FC, ReactNode } from 'react';
import { Tag } from '@navikt/ds-react';
import './StatusLinje.css';
import { StopWatch } from '@navikt/ds-icons';
import { Notifikasjon, OppgaveTidslinjeElement, OppgaveTilstand } from '../api/graphql-types';
import { formatterDato, uformellDatotekst } from '../utils/dato-funksjoner';

export interface StatusLinjeProps {
    oppgave: OppgaveTidslinjeElement;
    className?: string;
}

export const StatusLinje: FC<StatusLinjeProps> = ({ oppgave, className }) => {
    if (oppgave.__typename !== 'OppgaveTidslinjeElement') {
        console.log('Buuuuuu', oppgave.__typename);
        return null;
    }

    switch (oppgave.status) {
        case OppgaveTilstand.Utfoert:
            return (
                <Tag
                    size="small"
                    className={`tidslinje_StatusLinje ${className}`}
                    variant="success"
                >
                    Fullført{' '}
                    {oppgave.utfoertTidspunkt === undefined
                        ? null
                        : uformellDatotekst(new Date(oppgave.utfoertTidspunkt))}
                </Tag>
            );

        case OppgaveTilstand.Utgaatt:
            return (
                <Tag
                    size="small"
                    className={`tidslinje_StatusLinje ${className}`}
                    variant="neutral"
                >
                    <StatusIkonMedTekst icon={<StopWatch aria-hidden={true} />}>
                        Fristen gikk ut {uformellDatotekst(new Date(oppgave.utgaattTidspunkt))}
                    </StatusIkonMedTekst>
                </Tag>
            );

        case OppgaveTilstand.Ny:
            if (oppgave.frist === undefined && oppgave.paaminnelseTidspunkt === undefined) {
                return null;
            } else {
                let innhold;
                if (oppgave.frist === undefined && oppgave.paaminnelseTidspunkt !== undefined) {
                    innhold = <>Påminnelse</>;
                } else if (
                    oppgave.frist !== undefined &&
                    oppgave.paaminnelseTidspunkt === undefined
                ) {
                    innhold = <>Frist {formatterDato(new Date(oppgave.frist))}</>;
                } else {
                    innhold = (
                        <>Påminnelse &ndash; Frist {formatterDato(new Date(oppgave.frist))}</>
                    );
                }
                return (
                    <StatusMedFristPaminnelse className={className ?? ''}>
                        {' '}
                        {innhold}{' '}
                    </StatusMedFristPaminnelse>
                );
            }
        default:
            return null;
    }
};

type StatusMedFristPaminnelseProps = {
    children: ReactNode;
    className: string;
};

const StatusMedFristPaminnelse = ({ children, className }: StatusMedFristPaminnelseProps) => {
    return (
        <Tag size="small" className={`tidslinje_StatusLinje ${className}`} variant="warning">
            <StatusIkonMedTekst icon={<StopWatch aria-hidden={true} />}>
                {children}
            </StatusIkonMedTekst>
        </Tag>
    );
};

type StatusIkonMedTekstProps = {
    icon: ReactNode;
    className?: string;
    children: ReactNode;
};

const StatusIkonMedTekst: FC<StatusIkonMedTekstProps> = ({ icon, className, children }) => (
    <span className={`tidslinje_oppgave_status_text ${className}`}>
        {icon} {children}
    </span>
);
