import { BodyShort, Button, Detail, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import './SaksListe.css';
import {
    NyOppgaveIkon,
    OppgaveUtfortIkon,
    BeskjedIkon,
    TidslinjeLinjeIkon,
    TidslinjeLinjeIkonKort,
} from './OppgaveBeskjedIkoner';
import {
    BeskjedTidslinjeElement,
    OppgaveTidslinjeElement,
    Sak,
    TidslinjeElement,
} from '../../../api/graphql-types';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { StatusLinje } from '../../../GeneriskeElementer/StatusLinje';
import { Collapse, Expand } from '@navikt/ds-icons';

export const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});

type SakPanelProps = {
    sak: Sak;
    placeholder?: boolean;
};

export const SakPanel = ({
                             placeholder,
                             sak: { lenke, tittel, virksomhet, sisteStatus, tidslinje },
                         }: SakPanelProps) => {
    const fake = placeholder ?? false;
    const style: React.CSSProperties = fake ? { visibility: 'hidden' } : {};

    const [tidslinjeOpen, setTidslinjeOpen] = useState(false);

    return (
        <div className='sakscontainer'>
            <BodyShort size='small' style={style}>
                {virksomhet.navn.toUpperCase()}
            </BodyShort>

            <LenkeMedLogging href={lenke} loggLenketekst={tittel}>
                <Heading size='small'>{tittel}</Heading>
            </LenkeMedLogging>
            <div style={{ display: 'flex', gap: '16px' }}>
                <BodyShort size='small' style={style}>
                    <b>{sisteStatus.tekst}</b>
                </BodyShort>
                {tidslinje.length === 0 ? (
                    <Detail>{dateFormat.format(new Date(sisteStatus.tidspunkt))}</Detail>
                ) : null}
            </div>
            <div>
                {tidslinje.map((tidslinjeelement, i) => (
                    <Tidslinjeelement
                        key={`tidslinje-element_${i}`}
                        tidslinjeelement={tidslinjeelement}
                        indeks={i}
                        apen={tidslinjeOpen}
                        antall={tidslinje.length}
                        tidslinjeOpen={tidslinjeOpen}
                    />
                ))}
            </div>
            {tidslinje.length > 1 ? (
                <Button
                    className='tidslinje-vis-mer-knapp'
                    variant='tertiary'
                    onClick={() => setTidslinjeOpen(!tidslinjeOpen)}
                >
                    {tidslinjeOpen ? (
                        <div className='tidslinje-vis-mer'>
                            <Collapse /> <BodyShort> Vis mindre </BodyShort>
                        </div>
                    ) : (
                        <div className='tidslinje-vis-mer'>
                            <Expand /> <BodyShort> Vis mer </BodyShort>
                        </div>
                    )}
                </Button>
            ) : null}
        </div>
    );
};

type TidslinjeelementHelperProps = {
    tidslinjeelement: TidslinjeElement;
    indeks: number;
    apen: boolean;
    antall: number;
    tidslinjeOpen: boolean;
};

type TidslinjeelementProps = {
    tidslinjeelement: TidslinjeElement;
    erSist: boolean;
    tidslinjeOpen: boolean;
};

const Tidslinjeelement = ({
                              tidslinjeelement,
                              indeks,
                              apen,
                              antall,
                              tidslinjeOpen,
                          }: TidslinjeelementHelperProps) => {
    if (!apen && indeks > 0) return null;
    if (tidslinjeelement.__typename === 'BeskjedTidslinjeElement') {
        return (
            <BeskjedElement
                tidslinjeelement={tidslinjeelement}
                erSist={indeks === antall - 1}
                tidslinjeOpen={tidslinjeOpen}
            />
        );
    } else if (tidslinjeelement.__typename === 'OppgaveTidslinjeElement') {
        return (
            <OppgaveElement
                tidslinjeelement={tidslinjeelement}
                erSist={indeks === antall - 1}
                tidslinjeOpen={tidslinjeOpen}
            />
        );
    } else {
        return null;
    }
};

const BeskjedElement = ({ tidslinjeelement, erSist, tidslinjeOpen }: TidslinjeelementProps) => {
    const { tekst, opprettetTidspunkt } = tidslinjeelement as BeskjedTidslinjeElement;
    return (
        <div className='tidslinje-element'>
            <Detail className='tidslinje-element-tidspunkt'>
                {dateFormat.format(new Date(opprettetTidspunkt))}
            </Detail>
            <div className='tidslinje-element-ikon'>
                <BeskjedIkon />
            </div>
            <BodyShort className='tidslinje-element-tittel'>{tekst}</BodyShort>
            <div className='tidslinje-linje'>
                {erSist || !tidslinjeOpen ? null : <TidslinjeLinjeIkonKort />}
            </div>
        </div>
    );
};

const OppgaveElement = ({ tidslinjeelement, erSist, tidslinjeOpen }: TidslinjeelementProps) => {
    const { tilstand, tekst, opprettetTidspunkt, frist, paaminnelseTidspunkt } =
        tidslinjeelement as OppgaveTidslinjeElement;
    const ikon = {
        NY: <NyOppgaveIkon />,
        UTFOERT: <OppgaveUtfortIkon />,
        UTGAATT: <OppgaveUtfortIkon />,
    };
    return (
        <div className='tidslinje-element'>
            <Detail className='tidslinje-element-tidspunkt'>
                {dateFormat.format(new Date(opprettetTidspunkt))}
            </Detail>
            <div className='tidslinje-element-ikon'>{ikon[tilstand]}</div>
            <BodyShort className='tidslinje-element-tittel'>{tekst}</BodyShort>
            <div>
                <StatusLinje
                    className={'oppgave-element-paaminnelse'}
                    oppgave={tidslinjeelement as OppgaveTidslinjeElement}
                />
            </div>
            <div className='tidslinje-linje'>
                {erSist || !tidslinjeOpen ? null : frist === undefined &&
                paaminnelseTidspunkt === undefined ? (
                    <TidslinjeLinjeIkonKort />
                ) : (
                    <TidslinjeLinjeIkon />
                )}
            </div>
        </div>
    );
};
