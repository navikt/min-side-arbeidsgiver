import { BodyShort, Button, Detail, Heading, Tag } from '@navikt/ds-react';
import React, { useState } from 'react';
import './SaksListe.css';
import {
    BeskjedIkon,
    KalenderavtaleIkonBlå,
    KalenderavtaleIkonGrå,
    NesteStegIkon,
    NyOppgaveIkon,
    OppgaveUtfortIkon,
    SolidTidslinjeLinjeIkon,
    StipletTidslinjeLinjeIkon,
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
import { InternLenkeMedLogging, LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
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
    placeholder = false,
    tvingEkspander = false,
    lenkeTilSak = true,
    sak,
}: SakPanelProps) => {
    const style: React.CSSProperties = placeholder ? { visibility: 'hidden' } : {};
    return (
        <div className="sakscontainer">
            <div className="sakscontainer-top">
                <BodyShort size="small" style={style}>
                    {sak.virksomhet.navn.toUpperCase()}
                </BodyShort>
                <Tag variant="neutral">
                    {sak.merkelapp === 'Inntektsmelding'
                        ? 'Inntektsmelding sykepenger'
                        : sak.merkelapp}
                </Tag>
            </div>
            <Saksoverskrift lenkeTilSak={lenkeTilSak} sak={sak} />
            <div style={{ display: 'flex', gap: '16px' }}>
                <BodyShort size="small" style={style}>
                    <strong>{sak.sisteStatus.tekst}</strong>
                </BodyShort>
                {sak.tidslinje.length === 0 ? (
                    <Detail>{dateFormat.format(new Date(sak.sisteStatus.tidspunkt))}</Detail>
                ) : null}
            </div>
            <Tidslinje sak={sak} tvingEkspander={tvingEkspander} />
        </div>
    );
};

type SaksoverskriftProps = {
    lenkeTilSak: boolean;
    sak: Sak;
};

const Saksoverskrift = ({ lenkeTilSak, sak }: SaksoverskriftProps) => {
    if (lenkeTilSak) {
        if (typeof sak.lenke === 'string') {
            return (
                <LenkeMedLogging
                    href={sak.lenke}
                    loggLenketekst={`lenke til sak med merkelapp ${sak.merkelapp}`}
                >
                    <BodyShort className="sakstittel">{sak.tittel}</BodyShort>
                </LenkeMedLogging>
            );
        } else {
            return (
                <InternLenkeMedLogging
                    href={`/sak?saksid=${sak.id}`}
                    loggLenketekst={`lenke til sak med merkelapp ${sak.merkelapp}`}
                >
                    <BodyShort className="sakstittel">{sak.tittel}</BodyShort>
                </InternLenkeMedLogging>
            );
        }
    } else {
        return (
            <Heading size="small" level="2">
                {sak.tittel}
            </Heading>
        );
    }
};

type TidslinjeProps = {
    sak: Sak;
    tvingEkspander: boolean;
};
const Tidslinje = ({ sak, tvingEkspander }: TidslinjeProps) => {
    const [tidslinjeOpen, setTidslinjeOpen] = useState(tvingEkspander);
    const nesteStegTekst = sak.nesteSteg ?? undefined;
    const todos = sak.tidslinje.filter(
        (tidslinjeElement) =>
            (tidslinjeElement.__typename === 'OppgaveTidslinjeElement' &&
                tidslinjeElement.tilstand === 'NY') ||
            (tidslinjeElement.__typename === 'KalenderavtaleTidslinjeElement' &&
                tidslinjeElement.avtaletilstand === 'VENTER_SVAR_FRA_ARBEIDSGIVER')
    );
    return (
        <>
            <div>
                {nesteStegTekst !== undefined && (
                    <NesteSteg
                        nesteStegTekst={nesteStegTekst}
                        tidslinjeLengde={sak.tidslinje.length}
                    />
                )}
                {todos.map((tidslinjeelement, i) => (
                    <Tidslinjeelement
                        key={tidslinjeelement.id}
                        tidslinjeelement={tidslinjeelement}
                        indeks={i}
                        apen={tidslinjeOpen}
                        antall={sak.tidslinje.length}
                        tidslinjeOpen={tidslinjeOpen}
                    />
                ))}
                {sak.tidslinje.map((tidslinjeelement, i) => (
                    <Tidslinjeelement
                        key={tidslinjeelement.id}
                        tidslinjeelement={tidslinjeelement}
                        indeks={i}
                        apen={tidslinjeOpen}
                        antall={sak.tidslinje.length}
                        tidslinjeOpen={tidslinjeOpen}
                    />
                ))}
            </div>
            {sak.tidslinje.length > 1 && !tvingEkspander ? (
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
        </>
    );
};

type NesteStegProps = {
    nesteStegTekst?: string;
    tidslinjeLengde: number;
};

const NesteSteg = ({ nesteStegTekst, tidslinjeLengde }: NesteStegProps) => {
    return (
        <div className="neste_steg">
            <div style={{ gridArea: 'ikon' }}>
                <NesteStegIkon title="Neste steg" />
            </div>
            <div style={{ gridArea: 'linje', marginLeft: '1px' }}>
                {tidslinjeLengde > 0 ? <StipletTidslinjeLinjeIkon height={24} /> : null}
            </div>
            <BodyShort style={{ gridArea: 'tittel' }}>{nesteStegTekst}</BodyShort>
        </div>
    );
};

type TidslinjeelementHelperProps = {
    tidslinjeelement: TidslinjeElement;
    indeks: number;
    apen: boolean;
    antall: number;
    tidslinjeOpen: boolean;
    nesteSteg?: string;
};

type TidslinjeelementProps = {
    tidslinjeelement: TidslinjeElement;
    TidslinjeLinjeIkon: React.JSX.Element | null;
};

const Tidslinjeelement = ({
    tidslinjeelement,
    indeks,
    apen,
    antall,
    tidslinjeOpen,
}: TidslinjeelementHelperProps) => {
    if (!apen && indeks > 0) return null;
    const erSiste = indeks === antall - 1;

    if (tidslinjeelement.__typename === 'BeskjedTidslinjeElement') {
        return (
            <BeskjedElement
                tidslinjeelement={tidslinjeelement}
                TidslinjeLinjeIkon={
                    erSiste || !tidslinjeOpen ? null : <SolidTidslinjeLinjeIkon height={24} />
                }
            />
        );
    } else if (tidslinjeelement.__typename === 'OppgaveTidslinjeElement') {
        const { tilstand, frist, paaminnelseTidspunkt } =
            tidslinjeelement as OppgaveTidslinjeElement;
        return (
            <OppgaveElement
                tidslinjeelement={tidslinjeelement}
                TidslinjeLinjeIkon={
                    erSiste || !tidslinjeOpen ? null : tilstand === OppgaveTilstand.Ny &&
                      frist === null &&
                      paaminnelseTidspunkt === null ? (
                        <SolidTidslinjeLinjeIkon height={24} />
                    ) : (
                        <SolidTidslinjeLinjeIkon height={32} />
                    )
                }
            />
        );
    } else if (tidslinjeelement.__typename === 'KalenderavtaleTidslinjeElement') {
        const { startTidspunkt, lokasjon, digitalt } =
            tidslinjeelement as KalenderavtaleTidslinjeElement;

        const harPassert = new Date(startTidspunkt) < new Date();
        const ingenLokasjon = (lokasjon ?? undefined) === undefined && digitalt === false;

        return (
            <KalenderavtaleElement
                tidslinjeelement={tidslinjeelement}
                TidslinjeLinjeIkon={
                    erSiste || !tidslinjeOpen ? null : harPassert ? (
                        <SolidTidslinjeLinjeIkon height={ingenLokasjon ? 50 : 77} />
                    ) : (
                        <StipletTidslinjeLinjeIkon height={ingenLokasjon ? 50 : 77} />
                    )
                }
            />
        );
    } else {
        return null;
    }
};

const BeskjedElement = ({ tidslinjeelement, TidslinjeLinjeIkon }: TidslinjeelementProps) => {
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
            <div className="tidslinje-linje">{TidslinjeLinjeIkon}</div>
        </div>
    );
};

const OppgaveElement = ({ tidslinjeelement, TidslinjeLinjeIkon }: TidslinjeelementProps) => {
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
            <div className="tidslinje-linje">{TidslinjeLinjeIkon}</div>
        </div>
    );
};

const KalenderavtaleElement = ({ tidslinjeelement, TidslinjeLinjeIkon }: TidslinjeelementProps) => {
    if (tidslinjeelement.__typename !== 'KalenderavtaleTidslinjeElement') return null;

    const { avtaletilstand, tekst, startTidspunkt, sluttTidspunkt, lokasjon, digitalt } =
        tidslinjeelement as KalenderavtaleTidslinjeElement;

    const klokkeslett = new Intl.DateTimeFormat('no', {
        hour: 'numeric',
        minute: 'numeric',
    });

    const harPassert = new Date(startTidspunkt) < new Date();
    const ingenLokasjon = (lokasjon ?? undefined) === undefined && digitalt === false;

    return (
        <div className="tidslinje-element-kalenderavtale">
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
                    {dateFormat.format(new Date(startTidspunkt))} kl.{' '}
                    {klokkeslett.format(new Date(startTidspunkt))}
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
            <div className="tidslinje-linje">{TidslinjeLinjeIkon}</div>
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
