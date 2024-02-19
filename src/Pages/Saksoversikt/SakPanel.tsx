import { BodyShort, Button, Detail, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import './SaksListe.css';
import {
    BeskjedIkon,
    KalenderavtaleIkon,
    KalenderavtaleIkonBlå,
    KalenderavtaleIkonGrå,
    NyOppgaveIkon,
    OppgaveUtfortIkon,
    TidslinjeLinjeIkon,
    TidslinjeLinjeIkonKort,
    TidslinjeLinjeIkonLang,
    TidslinjeLinjeIkonStriplet,
} from './OppgaveBeskjedIkoner';
import {
    BeskjedTidslinjeElement,
    KalenderavtaleTidslinjeElement,
    KalenderavtaleTilstand,
    Lokasjon,
    OppgaveTidslinjeElement,
    OppgaveTilstand,
    Sak,
    TidslinjeElement,
} from '../../api/graphql-types';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { AvtaletilstandLinje, StatusLinje } from '../../GeneriskeElementer/StatusLinje';
import { Collapse, Expand } from '@navikt/ds-icons';
import { LocationPinIcon, PersonHeadsetIcon } from '@navikt/aksel-icons';

export const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});

type SakPanelProps = {
    sak: Sak;
    placeholder?: boolean;
    tvingEkspander?: boolean;
    lenkeTilSak?: boolean;
};

export const SakPanel = ({
    placeholder,
    tvingEkspander = false,
    lenkeTilSak = true,
    sak: { id, lenke, tittel, virksomhet, sisteStatus, tidslinje },
}: SakPanelProps) => {
    const fake = placeholder ?? false;
    const style: React.CSSProperties = fake ? { visibility: 'hidden' } : {};

    const [tidslinjeOpen, setTidslinjeOpen] = useState(tvingEkspander);

    return (
        <div className="sakscontainer">
            <BodyShort size="small" style={style}>
                {virksomhet.navn.toUpperCase()}
            </BodyShort>

            {lenkeTilSak ? (
                <LenkeMedLogging
                    href={lenke ?? `${__BASE_PATH__}/sak?saksid=${id}`}
                    loggLenketekst={tittel}
                >
                    <BodyShort className="sakstittel">{tittel}</BodyShort>
                </LenkeMedLogging>
            ) : (
                <Heading size="small" level="2">
                    {tittel}
                </Heading>
            )}
            <div style={{ display: 'flex', gap: '16px' }}>
                <BodyShort size="small" style={style}>
                    <strong>{sisteStatus.tekst}</strong>
                </BodyShort>
                {tidslinje.length === 0 ? (
                    <Detail>{dateFormat.format(new Date(sisteStatus.tidspunkt))}</Detail>
                ) : null}
            </div>
            <div>
                {tidslinje.map((tidslinjeelement, i) => (
                    <Tidslinjeelement
                        key={tidslinjeelement.id}
                        tidslinjeelement={tidslinjeelement}
                        indeks={i}
                        apen={tidslinjeOpen}
                        antall={tidslinje.length}
                        tidslinjeOpen={tidslinjeOpen}
                    />
                ))}
            </div>
            {tidslinje.length > 1 && !tvingEkspander ? (
                <Button
                    className="tidslinje-vis-mer-knapp"
                    variant="tertiary"
                    onClick={() => setTidslinjeOpen(!tidslinjeOpen)}
                    icon={
                        tidslinjeOpen ? (
                            <Collapse aria-hidden="true" />
                        ) : (
                            <Expand aria-hidden="true" />
                        )
                    }
                >
                    {tidslinjeOpen ? <>Vis mindre</> : <>Vis mer</>}
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
    } else if (tidslinjeelement.__typename === 'KalenderavtaleTidslinjeElement') {
        return (
            <KalenderavtaleElement
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
    if (tidslinjeelement.__typename !== 'BeskjedTidslinjeElement') return null;
    const { tekst, opprettetTidspunkt } = tidslinjeelement as BeskjedTidslinjeElement;
    return (
        <div className="tidslinje-element">
            <Detail className="tidslinje-element-tidspunkt">
                {dateFormat.format(new Date(opprettetTidspunkt))}
            </Detail>
            <div className="tidslinje-element-ikon">
                <BeskjedIkon />
            </div>
            <BodyShort className="tidslinje-element-tittel">{tekst}</BodyShort>
            <div className="tidslinje-linje">
                {erSist || !tidslinjeOpen ? null : <TidslinjeLinjeIkonKort />}
            </div>
        </div>
    );
};

const OppgaveElement = ({ tidslinjeelement, erSist, tidslinjeOpen }: TidslinjeelementProps) => {
    if (tidslinjeelement.__typename !== 'OppgaveTidslinjeElement') return null;
    const { tilstand, tekst, opprettetTidspunkt, frist, paaminnelseTidspunkt } =
        tidslinjeelement as OppgaveTidslinjeElement;
    const ikon = {
        NY: <NyOppgaveIkon />,
        UTFOERT: <OppgaveUtfortIkon />,
        UTGAATT: <OppgaveUtfortIkon />,
    };
    return (
        <div className="tidslinje-element">
            <Detail className="tidslinje-element-tidspunkt">
                {dateFormat.format(new Date(opprettetTidspunkt))}
            </Detail>
            <div className="tidslinje-element-ikon">{ikon[tilstand]}</div>
            <BodyShort className="tidslinje-element-tittel">{tekst}</BodyShort>
            <div>
                <StatusLinje
                    className={'oppgave-element-paaminnelse'}
                    oppgave={tidslinjeelement as OppgaveTidslinjeElement}
                />
            </div>
            <div className="tidslinje-linje">
                {erSist || !tidslinjeOpen ? null : tilstand === OppgaveTilstand.Ny &&
                  frist === null &&
                  paaminnelseTidspunkt === null ? (
                    <TidslinjeLinjeIkonKort />
                ) : (
                    <TidslinjeLinjeIkon />
                )}
            </div>
        </div>
    );
};

const KalenderavtaleElement = ({
    tidslinjeelement,
    erSist,
    tidslinjeOpen,
}: TidslinjeelementProps) => {
    if (tidslinjeelement.__typename !== 'KalenderavtaleTidslinjeElement') return null;

    const { avtaletilstand, tekst, startTidspunkt, sluttTidspunkt, lokasjon, digitalt } =
        tidslinjeelement as KalenderavtaleTidslinjeElement;

    const klokkeslett = new Intl.DateTimeFormat('no', {
        hour: 'numeric',
        minute: 'numeric',
    });

    const harPassert = new Date(startTidspunkt) < new Date();

    return (
        <div className="tidslinje-element">
            <Detail className="tidslinje-element-tidspunkt">
                {dateFormat.format(new Date(startTidspunkt))}
            </Detail>
            <div className="tidslinje-element-ikon">
                {avtaletilstand === KalenderavtaleTilstand.Avlyst || harPassert ? (
                    <KalenderavtaleIkonGrå
                        title={harPassert ? 'Avtaletidspunktet har passert.' : 'Møtet er avlyst.'}
                    />
                ) : (
                    <KalenderavtaleIkonBlå title={'Kommende kalenderavtale.'} />
                )}
            </div>
            <div className="tidslinje-element-tittel">
                <BodyShort>{tekst}</BodyShort>
                <BodyShort>
                    kl. {klokkeslett.format(new Date(startTidspunkt))}
                    {sluttTidspunkt !== undefined
                        ? ` – ${klokkeslett.format(new Date(sluttTidspunkt))}`
                        : ''}
                </BodyShort>
            </div>
            <div className="tidslinje-element-detaljer">
                <Sted sted={lokasjon ?? undefined} digitalt={digitalt ?? false} />
                <AvtaletilstandLinje
                    kalenderTidslinjeelement={tidslinjeelement as KalenderavtaleTidslinjeElement}
                />
            </div>
            <div className="tidslinje-linje">
                {erSist || !tidslinjeOpen ? null : harPassert ? (
                    <TidslinjeLinjeIkonLang />
                ) : (
                    <TidslinjeLinjeIkonStriplet />
                )}
            </div>
        </div>
    );
};

type Sted = {
    sted?: Lokasjon;
    digitalt: boolean;
};

const Sted = ({ sted, digitalt }: Sted) => (
    <div className="kalenderavtale_sted">
        {sted !== undefined ? (
            <>
                <LocationPinIcon aria-hidden={true} fontSize="1.5rem" />
                <div>
                    <Detail>
                        {sted.adresse}, {sted.postnummer} {sted.poststed}
                    </Detail>
                </div>
            </>
        ) : digitalt ? (
            <>
                <PersonHeadsetIcon aria-hidden={true} fontSize="1.5rem" />{' '}
                <BodyShort size="small"> Digital avtale </BodyShort>
            </>
        ) : null}
    </div>
);
