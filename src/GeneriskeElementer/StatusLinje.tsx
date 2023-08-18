import React, { FC, ReactNode } from 'react';
import { Tag } from '@navikt/ds-react';
import './StatusLinje.css';
import { StopWatch } from '@navikt/ds-icons';
import { OppgaveTidslinjeElement, OppgaveTilstand } from '../api/graphql-types';
import { dateFormat } from '../App/Hovedside/Sak/SakPanel';

export interface StatusLinjeProps {
    oppgave: OppgaveTidslinjeElement;
    className?: string;
}

export const uformellDatotekst = (dato: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (dateFormat.format(dato)) {
        case dateFormat.format(today):
            return 'i dag';
        case dateFormat.format(yesterday):
            return 'i går';
        case dateFormat.format(tomorrow):
            return 'i morgen';
        default:
            return dateFormat.format(dato);
    }
};

export const StatusLinje: FC<StatusLinjeProps> = ({ oppgave, className }) => {
    if (oppgave.__typename !== 'OppgaveTidslinjeElement') {
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
                    innhold = <>Frist {dateFormat.format(new Date(oppgave.frist))}</>;
                } else {
                    innhold = (
                        <>Påminnelse &ndash; Frist {dateFormat.format(new Date(oppgave.frist))}</>
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
