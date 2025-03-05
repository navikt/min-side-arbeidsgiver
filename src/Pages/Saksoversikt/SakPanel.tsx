import { BodyShort, Button, Detail, Heading, Tag } from '@navikt/ds-react';
import React, { useState } from 'react';
import './SaksListe.css';
import {
    BeskjedIkon,
    DelvisStipletTidslinjeLinjeIkon,
    KalenderavtaleIkon,
    NesteStegIkon,
    NyOppgaveIkon,
    OppgaveUtfortIkon,
    OppgaveUtgaattIkon,
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
    placeholder = false,
    tvingEkspander = false,
    lenkeTilSak = true,
    sak,
}: SakPanelProps) => {
    const style: React.CSSProperties = placeholder ? { visibility: 'hidden' } : {};

    const harAktuelleElementer = sak.tidslinje.some((tidslinjeElement) => {
        if (tidslinjeElement.__typename === 'OppgaveTidslinjeElement') {
            return tidslinjeElement.tilstand === 'NY';
        } else if (tidslinjeElement.__typename === 'KalenderavtaleTidslinjeElement') {
            return tidslinjeElement.avtaletilstand === 'VENTER_SVAR_FRA_ARBEIDSGIVER';
        }
        return false;
    });

    return (
        <div className={`sakscontainer ${harAktuelleElementer ? 'oransje-kant' : ''}`}>
            <div className="sakscontainer-top">
                <BodyShort size="small" style={style}>
                    {sak.virksomhet.navn.toUpperCase()}
                </BodyShort>
                <Tag size="small" variant="neutral">
                    {sak.merkelapp === 'Inntektsmelding'
                        ? 'Inntektsmelding sykepenger'
                        : sak.merkelapp}
                </Tag>
            </div>
            <Saksoverskrift lenkeTilSak={lenkeTilSak} sak={sak} />
            {sak.tilleggsinformasjon !== null ? (
                <BodyShort>{sak.tilleggsinformasjon}</BodyShort>
            ) : null}
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
            return <BodyShort className="sakstittel">{sak.tittel}</BodyShort>;
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

const Tidslinjeelement = ({
    tidslinjeelement,
    skjulLinjeIkon,
    brukDelvisStipletLinjeIkon,
    visSomLenke,
}: {
    tidslinjeelement: TidslinjeElement;
    skjulLinjeIkon: boolean;
    brukDelvisStipletLinjeIkon: boolean;
    visSomLenke: boolean;
}) => {
    if (tidslinjeelement.__typename === 'BeskjedTidslinjeElement') {
        return (
            <BeskjedElement
                key={tidslinjeelement.id}
                tidslinjeelement={tidslinjeelement}
                visSomLenke={visSomLenke}
                TidslinjeLinjeIkon={
                    brukDelvisStipletLinjeIkon ? (
                        <DelvisStipletTidslinjeLinjeIkon height={24} />
                    ) : skjulLinjeIkon ? null : (
                        <SolidTidslinjeLinjeIkon height={100} />
                    )
                }
            />
        );
    } else if (tidslinjeelement.__typename === 'OppgaveTidslinjeElement') {
        const { frist, paaminnelseTidspunkt, tilstand } = tidslinjeelement;
        return (
            <OppgaveElement
                key={tidslinjeelement.id}
                tidslinjeelement={tidslinjeelement}
                visSomLenke={visSomLenke}
                TidslinjeLinjeIkon={
                    brukDelvisStipletLinjeIkon ? (
                        <DelvisStipletTidslinjeLinjeIkon
                            height={
                                (frist === null && paaminnelseTidspunkt === null) ||
                                tilstand === OppgaveTilstand.Utfoert
                                    ? 24
                                    : 48
                            }
                        />
                    ) : skjulLinjeIkon ? null : (
                        <SolidTidslinjeLinjeIkon height={100} />
                    )
                }
            />
        );
    } else if (tidslinjeelement.__typename === 'KalenderavtaleTidslinjeElement') {
        const { startTidspunkt, lokasjon, digitalt } = tidslinjeelement;
        const harPassert = new Date(startTidspunkt) < new Date();
        const ingenLokasjon = (lokasjon ?? undefined) === undefined && digitalt === false;
        const ikonHøyde = ingenLokasjon ? 24 : 48;
        return (
            <KalenderavtaleElement
                key={tidslinjeelement.id}
                tidslinjeelement={tidslinjeelement}
                visSomLenke={visSomLenke}
                TidslinjeLinjeIkon={
                    brukDelvisStipletLinjeIkon ? (
                        <DelvisStipletTidslinjeLinjeIkon height={ikonHøyde} />
                    ) : skjulLinjeIkon ? null : harPassert ? (
                        <SolidTidslinjeLinjeIkon height={100} />
                    ) : (
                        <StipletTidslinjeLinjeIkon height={100} />
                    )
                }
            />
        );
    } else {
        console.error(`#MSA: uforventet tidslinjeelement type ${tidslinjeelement.__typename}`);
        return null;
    }
};

const Tidslinje = ({ sak, tvingEkspander }: TidslinjeProps) => {
    const [tidslinjeOpen, setTidslinjeOpen] = useState(tvingEkspander);
    const nesteStegTekst = sak.nesteSteg ?? undefined;
    const todos = tidslinjeOpen
        ? []
        : sak.tidslinje.filter(
              (tidslinjeElement) =>
                  (tidslinjeElement.__typename === 'OppgaveTidslinjeElement' &&
                      tidslinjeElement.tilstand === 'NY') ||
                  (tidslinjeElement.__typename === 'KalenderavtaleTidslinjeElement' &&
                      tidslinjeElement.avtaletilstand === 'VENTER_SVAR_FRA_ARBEIDSGIVER')
          );
    const tidslinje = tidslinjeOpen
        ? sak.tidslinje
        : todos.length === 0
          ? sak.tidslinje.slice(0, 1)
          : [];

    return (
        <>
            <div className="tidslinje">
                {nesteStegTekst !== undefined && (
                    <NesteSteg
                        nesteStegTekst={nesteStegTekst}
                        tidslinjeLengde={sak.tidslinje.length}
                    />
                )}
                {sak.tidslinje.length === 1 ? (
                    <Tidslinjeelement
                        tidslinjeelement={sak.tidslinje[0]}
                        skjulLinjeIkon={true}
                        brukDelvisStipletLinjeIkon={false}
                        visSomLenke={visSomLenke({
                            sakLenke: sak.lenke,
                            notifikasjonsLenke: sak.tidslinje[0].lenke,
                        })}
                    />
                ) : (
                    <>
                        {todos.map((tidslinjeelement, _) => (
                            <Tidslinjeelement
                                key={tidslinjeelement.id}
                                tidslinjeelement={tidslinjeelement}
                                skjulLinjeIkon={false}
                                brukDelvisStipletLinjeIkon={true}
                                visSomLenke={visSomLenke({
                                    sakLenke: sak.lenke,
                                    notifikasjonsLenke: tidslinjeelement.lenke,
                                })}
                            />
                        ))}
                        {tidslinje.map((tidslinjeelement, i) => {
                            const erSist = sak.tidslinje.length - 1;
                            return (
                                <Tidslinjeelement
                                    key={tidslinjeelement.id}
                                    tidslinjeelement={tidslinjeelement}
                                    skjulLinjeIkon={i === erSist}
                                    brukDelvisStipletLinjeIkon={!tidslinjeOpen}
                                    visSomLenke={visSomLenke({
                                        sakLenke: sak.lenke,
                                        notifikasjonsLenke: tidslinjeelement.lenke,
                                    })}
                                />
                            );
                        })}
                    </>
                )}
            </div>
            {sak.tidslinje.length > 1 && !tvingEkspander ? (
                <div>
                    <Button
                        className="tidslinje-vis-mer-knapp"
                        variant="tertiary"
                        size="small"
                        onClick={() => setTidslinjeOpen(!tidslinjeOpen)}
                        icon={
                            tidslinjeOpen ? (
                                <Collapse aria-hidden="true" />
                            ) : (
                                <Expand aria-hidden="true" />
                            )
                        }
                    >
                        {tidslinjeOpen ? <>Vis mindre</> : <>Vis alt som har skjedd i saken</>}
                    </Button>
                </div>
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

const BeskjedElement = ({
    tidslinjeelement,
    TidslinjeLinjeIkon,
    visSomLenke,
}: {
    tidslinjeelement: TidslinjeElement;
    TidslinjeLinjeIkon: React.JSX.Element | null;
    visSomLenke: boolean;
}) => {
    if (tidslinjeelement.__typename !== 'BeskjedTidslinjeElement') return null;
    const { tekst, opprettetTidspunkt, lenke } = tidslinjeelement as BeskjedTidslinjeElement;
    return (
        <div className="grid2x3">
            <div className="tidslinje-element-ikon">
                <BeskjedIkon title="Beskjed" />
            </div>
            <NotifikasjonsLenke lenke={lenke} visSomLenke={visSomLenke}>
                <BodyShort className="tidslinje-element-tittel">{tekst}</BodyShort>
            </NotifikasjonsLenke>
            <Detail className="tidslinje-element-detaljer">
                {dateFormat.format(new Date(opprettetTidspunkt))}
            </Detail>
            <div className="tidslinje-linje">{TidslinjeLinjeIkon}</div>
        </div>
    );
};

const OppgaveElement = ({
    tidslinjeelement,
    TidslinjeLinjeIkon,
    visSomLenke,
}: {
    tidslinjeelement: TidslinjeElement;
    TidslinjeLinjeIkon: React.JSX.Element | null;
    visSomLenke: boolean;
}) => {
    if (tidslinjeelement.__typename !== 'OppgaveTidslinjeElement') return null;
    const { tilstand, tekst, opprettetTidspunkt, lenke } =
        tidslinjeelement as OppgaveTidslinjeElement;

    const ikon = {
        NY: <NyOppgaveIkon title="Uløst oppgave" />,
        UTFOERT: <OppgaveUtfortIkon title="Utført oppgave" />,
        UTGAATT: <OppgaveUtgaattIkon title="Utgått oppgave" />,
    };
    return (
        <div className={tilstand === OppgaveTilstand.Utfoert ? 'grid2x3' : 'grid2x4'}>
            <div className="tidslinje-element-ikon">{ikon[tilstand]}</div>
            <NotifikasjonsLenke lenke={lenke} visSomLenke={visSomLenke}>
                <BodyShort
                    weight={tilstand === OppgaveTilstand.Ny ? 'semibold' : 'regular'}
                    className="tidslinje-element-tittel"
                >
                    {tekst}
                </BodyShort>
            </NotifikasjonsLenke>
            {tilstand === OppgaveTilstand.Utfoert ? (
                <div className="tidslinje-element-detaljer">
                    <StatusLinje oppgave={tidslinjeelement as OppgaveTidslinjeElement} />
                </div>
            ) : (
                <>
                    <Detail className="tidslinje-element-detaljer">
                        {dateFormat.format(new Date(opprettetTidspunkt))}
                    </Detail>
                    <div className="tidslinje-element-detaljer2">
                        <StatusLinje oppgave={tidslinjeelement as OppgaveTidslinjeElement} />
                    </div>
                </>
            )}
            <div className="tidslinje-linje">{TidslinjeLinjeIkon}</div>
        </div>
    );
};

const KalenderavtaleElement = ({
    tidslinjeelement,
    TidslinjeLinjeIkon,
    visSomLenke,
}: {
    tidslinjeelement: TidslinjeElement;
    TidslinjeLinjeIkon: React.JSX.Element | null;
    visSomLenke: boolean;
}) => {
    if (tidslinjeelement.__typename !== 'KalenderavtaleTidslinjeElement') return null;

    const { avtaletilstand, tekst, startTidspunkt, sluttTidspunkt, lokasjon, digitalt, lenke } =
        tidslinjeelement as KalenderavtaleTidslinjeElement;

    const klokkeslett = new Intl.DateTimeFormat('no', {
        hour: 'numeric',
        minute: 'numeric',
    });

    const harPassert = new Date(startTidspunkt) < new Date();
    const ingenLokasjon = (lokasjon ?? undefined) === undefined && digitalt === false;
    return (
        <div className={ingenLokasjon ? 'grid2x3' : 'grid2x4'}>
            <div className="tidslinje-element-ikon">
                {avtaletilstand === KalenderavtaleTilstand.Avlyst ||
                avtaletilstand === KalenderavtaleTilstand.Avholdt ? (
                    <KalenderavtaleIkon
                        variant="grå"
                        title={
                            harPassert
                                ? 'Kalenderavtale som er avholdt.'
                                : 'Kalenderavtale som er avlyst.'
                        }
                    />
                ) : avtaletilstand === KalenderavtaleTilstand.VenterSvarFraArbeidsgiver ? (
                    <KalenderavtaleIkon
                        variant="oransje"
                        title={'Kalenderavtale som du må svare på.'}
                    />
                ) : (
                    <KalenderavtaleIkon
                        variant="blå"
                        title={'Kalenderavtale som du har svart på.'}
                    />
                )}
            </div>
            <NotifikasjonsLenke lenke={lenke} visSomLenke={visSomLenke}>
                <BodyShort
                    className="tidslinje-element-tittel"
                    weight={
                        avtaletilstand === KalenderavtaleTilstand.VenterSvarFraArbeidsgiver
                            ? 'semibold'
                            : 'regular'
                    }
                >
                    {tekst}
                </BodyShort>
                <BodyShort
                    size="large"
                    weight={
                        avtaletilstand === KalenderavtaleTilstand.VenterSvarFraArbeidsgiver
                            ? 'semibold'
                            : 'regular'
                    }
                >
                    {dateFormat.format(new Date(startTidspunkt))} kl.{' '}
                    {klokkeslett.format(new Date(startTidspunkt))}
                    {sluttTidspunkt !== undefined && sluttTidspunkt !== null
                        ? ` – ${klokkeslett.format(new Date(sluttTidspunkt))}`
                        : ''}
                </BodyShort>
            </NotifikasjonsLenke>

            {ingenLokasjon ? (
                <div className={'tidslinje-element-detaljer'}>
                    <AvtaletilstandLinje
                        kalenderTidslinjeelement={
                            tidslinjeelement as KalenderavtaleTidslinjeElement
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="tidslinje-element-detaljer">
                        <Sted sted={lokasjon ?? undefined} digitalt={digitalt ?? false} />
                    </div>
                    <div className="tidslinje-element-detaljer2">
                        <AvtaletilstandLinje
                            kalenderTidslinjeelement={
                                tidslinjeelement as KalenderavtaleTidslinjeElement
                            }
                        />
                    </div>
                </>
            )}

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
                <LocationPinIcon aria-hidden={true} fontSize="16px" />
                <div>
                    <Detail>
                        {sted.adresse}, {sted.postnummer} {sted.poststed}
                    </Detail>
                </div>
            </>
        ) : digitalt ? (
            <>
                <PersonHeadsetIcon aria-hidden={true} fontSize="1rem" />{' '}
                <BodyShort size="small"> Digital avtale </BodyShort>
            </>
        ) : null}
    </div>
);

const NotifikasjonsLenke = ({
    lenke,
    children,
    visSomLenke,
}: {
    lenke: string;
    children: React.ReactNode;
    visSomLenke: boolean;
}) => (visSomLenke ? <a href={lenke}>{children}</a> : children);

export const visSomLenke = ({
    sakLenke,
    notifikasjonsLenke,
}: {
    sakLenke?: string | null;
    notifikasjonsLenke?: string | null;
}) => {
    // - Dersom lenke på notifikasjonen er identisk med lenken på saken, viser vi ikke lenken på notifikasjonen
    // - Dersom lenke i tidslinjen er til “sakssiden” så ikke vis lenke (lenkeløs sak)
    if (
        notifikasjonsLenke == null ||
        notifikasjonsLenke === '' ||
        notifikasjonsLenke.includes(`${__BASE_PATH__}/sak`)
    ) {
        return false;
    }

    return sakLenke !== notifikasjonsLenke;
};
