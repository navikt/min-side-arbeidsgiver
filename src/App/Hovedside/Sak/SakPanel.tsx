import { BodyShort, Detail, Heading, Switch } from '@navikt/ds-react';
import React from 'react';
import { loggNavigasjonTags } from '../../../utils/funksjonerForAmplitudeLogging';
import { useLocation } from 'react-router-dom';
import './SaksListe.css';
import {
    NyOppgaveIkon,
    OppgaveUtfortIkon,
    BeskjedIkon,
    TidslinjeLinjeIkon,
} from './OppgaveBeskjedIkoner';
import {
    BeskjedTidslinjeElement,
    OppgaveMetadata,
    OppgaveTidslinjeElement,
    OppgaveTilstand,
    Sak,
} from '../../../api/graphql-types';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { sendtDatotekst } from '../../../utils/dato-funksjoner';
import { StatusLinje } from '../../../GeneriskeElementer/StatusLinje';

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
});

type SakPanelProps = {
    sak: Sak;
    placeholder?: boolean;
};

export const SakPanel = ({
    placeholder,
    sak: { lenke, tittel, virksomhet, sisteStatus, tidslinje, frister, oppgaver },
}: SakPanelProps) => {
    const fake = placeholder ?? false;
    const style: React.CSSProperties = fake ? { visibility: 'hidden' } : {};
    const { pathname } = useLocation();
    const [frist] = frister;
    const paminnelse: boolean = oppgaver.some(
        (oppgave: OppgaveMetadata) =>
            oppgave.tilstand === OppgaveTilstand.Ny && oppgave.paaminnelseTidspunkt !== null
    );

    return (
        <div className="sakscontainer">
            <BodyShort size="small" style={style}>
                {virksomhet.navn.toUpperCase()}
            </BodyShort>

            <LenkeMedLogging href={lenke} loggLenketekst={tittel}>
                <Heading size="small">{tittel}</Heading>
            </LenkeMedLogging>

            <BodyShort size="small" style={style}>
                <b>{sisteStatus.tekst}</b>
            </BodyShort>
            {tidslinje.map((tidslinjeelement, i) => (
                <>
                    {i > 0 ? <TidslinjeLinjeIkon /> : null}
                    {tidslinjeelement.__typename === 'BeskjedTidslinjeElement' ? (
                        <BeskjedElement beskjed={tidslinjeelement} />
                    ) : tidslinjeelement.__typename === 'OppgaveTidslinjeElement' ? (
                        <OppgaveElement oppgave={tidslinjeelement} />
                    ) : null}
                </>
            ))}
        </div>
    );
};

type BeskjedElementProps = {
    beskjed: BeskjedTidslinjeElement;
};

const BeskjedElement = ({ beskjed }: BeskjedElementProps) => {
    const { tittel, opprettetTidspunkt } = beskjed;
    return (
        <div className="beskjed-element">
            <Detail className="tidslinje-element-tidspunkt">
                {sendtDatotekst(new Date(opprettetTidspunkt))}
            </Detail>
            <div className="tidslinje-element-ikon">
                <BeskjedIkon />
            </div>
            <BodyShort className="tidslinje-element-tittel">{tittel}</BodyShort>
        </div>
    );
};

type OppgaveELementProps = {
    oppgave: OppgaveTidslinjeElement;
};

const OppgaveElement = ({ oppgave }: OppgaveELementProps) => {
    const {
        frist,
        paaminnelseTidspunkt,
        status,
        tittel,
        opprettetTidspunkt,
        utfoertTidspunkt,
        utgaattTidspunkt,
    } = oppgave;
    const ikon = {
        NY: <NyOppgaveIkon />,
        UTFOERT: <OppgaveUtfortIkon />,
        UTGAATT: <OppgaveUtfortIkon />,
    };
    return (
        <div className="oppgave-element">
            <Detail className="tidslinje-element-tidspunkt">
                {sendtDatotekst(new Date(opprettetTidspunkt))}
            </Detail>
            <div className="tidslinje-element-ikon">{ikon[status]}</div>
            <BodyShort className="tidslinje-element-tittel">{tittel}</BodyShort>
            <StatusLinje className={'oppgave-element-paaminnelse'} oppgave={oppgave} />
        </div>
    );
};
