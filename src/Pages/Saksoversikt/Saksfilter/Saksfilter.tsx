import React, { FC, useEffect, useRef, useState } from 'react';
import './Saksfilter.css';
import { Virksomhetsmeny } from './Virksomhetsmeny/Virksomhetsmeny';
import { Søkeboks } from './Søkeboks';
import { Ekspanderbartpanel } from '../../../GeneriskeElementer/Ekspanderbartpanel';
import { BodyShort, Checkbox, CheckboxGroup, Heading, Label } from '@navikt/ds-react';
import { Filter as FilterIkon } from '@navikt/ds-icons';
import {
    OppgaveTilstand,
    OppgaveTilstandInfo,
    Sakstype,
    SakstypeOverordnet,
} from '../../../api/graphql-types';
import { capitalize, sorted, splittListe } from '../../../utils/util';
import { Set } from 'immutable';
import amplitude from '../../../utils/amplitude';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { opprettInntektsmeldingURL } from '../../../lenker';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganisasjonerOgTilgangerContext } from '../../OrganisasjonerOgTilgangerContext';
import { Filter } from '../SaksoversiktProvider';

type SaksfilterProps = {
    filter: Filter;
    setFilter: (filter: Filter) => void;
    valgteVirksomheter: Set<string>;
    setValgteVirksomheter: (valgteVirksomheter: Set<string>) => void;
    sakstypeinfo: Sakstype[] | undefined;
    alleSakstyper: SakstypeOverordnet[];
    oppgaveTilstandInfo: OppgaveTilstandInfo[] | undefined;
};

export const oppgaveTilstandTilTekst = (oppgavetilstand: OppgaveTilstand) => {
    switch (oppgavetilstand) {
        case OppgaveTilstand.Ny:
            return 'Uløste oppgaver';
        default:
            return '';
    }
};

type KollapsHvisMobilProps = {
    width: number;
    children?: React.ReactNode | undefined;
};

const KollapsHvisMobil: FC<KollapsHvisMobilProps> = ({
    width,
    children,
}: KollapsHvisMobilProps) => {
    if (width < 730) {
        return (
            <Ekspanderbartpanel tittel="Filtrering" ikon={<FilterIkon aria-hidden="true" />}>
                {children}
            </Ekspanderbartpanel>
        );
    } else {
        return <>{children}</>;
    }
};

export const amplitudeFilterKlikk = (kategori: string, filternavn: string, target: EventTarget | null) => {
    if (target instanceof HTMLInputElement) {
        amplitude.logEvent('filtervalg', {
            kategori: kategori,
            filternavn: filternavn,
            checked: target.checked,
        });
    } else {
        amplitude.logEvent('filtervalg', {
            kategori: kategori,
            filternavn: filternavn,
        });
    }
};

/**
 * TAG-2253 - Slår sammen "Inntektsmelding" og "Inntektsmelding sykepenger" til en sakstype
 * Når "Inntektsmelding" er faset ut og saker med merkelappen ikke finnes lengre vil den hete
 * "Inntektsmelding sykepenger" og denne funksjonen kan slettes
 */
function sakstyperMedAntall(
    alleSakstyper: SakstypeOverordnet[],
    sakstypeinfo: Sakstype[] | undefined
) {
    const sakstyperForFilter = alleSakstyper.map((sakstypeOverordnet) => ({
        navn: sakstypeOverordnet.navn,
        antall:
            sakstypeinfo === undefined
                ? undefined
                : sakstypeinfo.find((sakstype) => sakstype.navn === sakstypeOverordnet.navn)
                      ?.antall ?? 0,
    }));

    const [sakstyperMedInntektsmeldingSykepenger, sakstyperUtenInntektsmeldingSykepenger] =
        splittListe(
            sakstyperForFilter,
            (filter) =>
                filter.navn === 'Inntektsmelding' || filter.navn === 'Inntektsmelding sykepenger'
        );

    const antallInntektsmeldingSykepenger = sakstyperForFilter
        .filter(({ navn }) => navn === 'Inntektsmelding' || navn === 'Inntektsmelding sykepenger')
        .reduce((acc, { antall }) => acc + (antall ?? 0), 0);
    return [
        ...sakstyperUtenInntektsmeldingSykepenger,
        ...(sakstyperMedInntektsmeldingSykepenger.length > 0
            ? [
                  {
                      navn: 'Inntektsmelding sykepenger',
                      antall: antallInntektsmeldingSykepenger,
                  },
              ]
            : []),
    ];
}

const InntektsmeldingGruppe = (
    antall: number | undefined,
    inntektsmeldingSakstyper: { navn: string; antall: number | undefined }[],
    filter: Filter,
    setFilter: (filter: Filter) => void
) => {
    const alleInntektsmeldingstypeNavn = inntektsmeldingSakstyper.map(({ navn }) => navn);

    const inntektsmeldingAlleValgtAvBruker = filter.sakstyper.includes('Inntektsmelding_gruppe');
    const andreInntektsmeldingerValgt = filter.sakstyper.some(
        (sakstype) => sakstype.includes('Inntektsmelding') && sakstype !== 'Inntektsmelding_gruppe'
    );

    let [valgteInntektsmeldingtyper, andreSakstyper] = splittListe(filter.sakstyper, (navn) =>
        navn.includes('Inntektsmelding')
    );

    if (inntektsmeldingAlleValgtAvBruker) {
        valgteInntektsmeldingtyper = ['Inntektsmelding_gruppe'];
    } else if (andreInntektsmeldingerValgt) {
        valgteInntektsmeldingtyper = [...valgteInntektsmeldingtyper, 'Inntektsmelding_gruppe'];
    }

    const handleChange = (valgteInntektsmeldingSakstyper: string[]) => {
        if (!valgteInntektsmeldingSakstyper.includes('Inntektsmelding_gruppe')) {
            //Bruker velger bort Inntektsmelding_gruppe
            setFilter({ ...filter, sakstyper: andreSakstyper });
            return;
        }
        if (
            valgteInntektsmeldingSakstyper.length === 1 &&
            valgteInntektsmeldingSakstyper.includes('Inntektsmelding_gruppe')
        ) {
            setFilter({
                ...filter,
                sakstyper: [
                    ...andreSakstyper,
                    ...alleInntektsmeldingstypeNavn,
                    'Inntektsmelding_gruppe',
                ],
            });
            return;
        }

        setFilter({
            ...filter,
            sakstyper: [
                ...andreSakstyper,
                ...valgteInntektsmeldingSakstyper.filter(
                    (navn) => navn !== 'Inntektsmelding_gruppe'
                ),
            ],
        });
    };

    if (inntektsmeldingSakstyper.length === 0) {
        return null;
    }

    return (
        <CheckboxGroup
            key="Inntektsmelding_gruppe"
            legend={'Inntektsmeldinger'}
            hideLegend={true}
            value={valgteInntektsmeldingtyper}
            onChange={(valgte) => handleChange(valgte)}
        >
            <Checkbox
                key="Inntektsmelding_gruppe"
                value="Inntektsmelding_gruppe"
                onClick={(e) =>
                    amplitudeFilterKlikk('sakstype', 'Inntektsmelding_gruppe', e.target)
                }
            >
                <BodyShort>
                    {antall === undefined ? 'Inntektsmelding' : `Inntektsmelding (${antall})`}
                </BodyShort>
            </Checkbox>
            {valgteInntektsmeldingtyper.length < 1
                ? null
                : sorted(inntektsmeldingSakstyper, ({ navn }) => navn).map(({ navn, antall }) => {
                      const visningsNavn = capitalize(navn.replace('Inntektsmelding ', ''));
                      return (
                          <Checkbox
                              className={'inntektsmelding-sakstype'}
                              key={navn}
                              value={navn}
                              onClick={(e) => amplitudeFilterKlikk('sakstype', navn, e.target)}
                          >
                              <BodyShort>
                                  {antall === undefined
                                      ? visningsNavn
                                      : `${visningsNavn} (${antall})`}
                              </BodyShort>
                          </Checkbox>
                      );
                  })}
        </CheckboxGroup>
    );
};

export const Saksfilter = ({
    valgteVirksomheter,
    setValgteVirksomheter,
    filter,
    setFilter,
    sakstypeinfo,
    oppgaveTilstandInfo,
    alleSakstyper,
}: SaksfilterProps) => {
    const [width, setWidth] = useState(window.innerWidth);
    const { organisasjonstre } = useOrganisasjonerOgTilgangerContext();

    useEffect(() => {
        const setSize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [setWidth]);

    useEffect(() => {
        amplitude.logEvent('komponent-lastet', {
            komponent: 'Saksfilter',
        });
    }, []);

    if (organisasjonstre === undefined) {
        return null;
    }
    const antallUløsteOppgaver = oppgaveTilstandInfo?.find(
        (oppgaveTilstand) => oppgaveTilstand.tilstand === OppgaveTilstand.Ny
    )?.antall;

    const sakstyperForFilter = sakstyperMedAntall(alleSakstyper, sakstypeinfo);

    const [inntektsmeldingSakstyper, sakstyperUtenInntektsmelding] = splittListe(
        sakstyperForFilter,
        (filter) => filter.navn.includes('Inntektsmelding')
    );

    const sakstyper = [
        ...sakstyperUtenInntektsmelding,
        {
            navn: 'Inntektsmelding_gruppe',
            antall: inntektsmeldingSakstyper.reduce((acc, { antall }) => acc + (antall ?? 0), 0),
        },
    ];

    return (
        <KollapsHvisMobil width={width}>
            <div className="saksfilter">
                <Heading level="2" size="medium" className="saksoversikt__skjult-header-uu">
                    Saksfilter
                </Heading>
                <Søkeboks></Søkeboks>

                <CheckboxGroup
                    value={filter.oppgaveFilter.oppgaveTilstand}
                    legend={'Oppgaver'}
                    onChange={(valgteOppgavetilstander) => //TODO: fix setFIlter
                        setFilter({ ...filter, oppgaveFilter: { harPåminnelseUtløst: false, oppgaveTilstand: valgteOppgavetilstander }})
                    }
                >
                    <Checkbox
                        value={OppgaveTilstand.Ny}
                        onClick={(e) =>
                            amplitudeFilterKlikk('oppgave', OppgaveTilstand.Ny, e.target)
                        }
                    >
                        <BodyShort>
                            {oppgaveTilstandTilTekst(OppgaveTilstand.Ny)}
                            {oppgaveTilstandInfo ? ` (${antallUløsteOppgaver ?? '0'})` : ''}
                        </BodyShort>
                    </Checkbox>
                </CheckboxGroup>
                {sakstyperForFilter.length > 1 && (
                    <CheckboxGroup
                        legend="Tema"
                        value={filter.sakstyper}
                        onChange={(valgteSakstyper) => {
                            setFilter({ ...filter, sakstyper: valgteSakstyper });
                        }}
                    >
                        {sorted(sakstyper, (sakstype) => sakstype.navn).map(({ navn, antall }) => {
                            if (navn === 'Inntektsmelding_gruppe') {
                                return InntektsmeldingGruppe(
                                    antall,
                                    inntektsmeldingSakstyper,
                                    filter,
                                    setFilter
                                );
                            } else {
                                return (
                                    <Checkbox
                                        key={navn}
                                        value={navn}
                                        onClick={(e) =>
                                            amplitudeFilterKlikk('sakstype', navn, e.target)
                                        }
                                    >
                                        <BodyShort>
                                            {antall === undefined ? navn : `${navn} (${antall})`}
                                        </BodyShort>
                                    </Checkbox>
                                );
                            }
                        })}
                    </CheckboxGroup>
                )}

                <Virksomhetsmeny
                    valgteEnheter={valgteVirksomheter}
                    setValgteEnheter={setValgteVirksomheter}
                />

                <OpprettInntektsmelding />
            </div>
        </KollapsHvisMobil>
    );
};

const OpprettInntektsmelding = () => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    const tilgangInntektsmelding = Object.values(organisasjonsInfo).some(
        (org) => org.altinntilgang?.inntektsmelding === true
    );
    const ref = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.hash === '#opprett-inntektsmelding') {
            scroll(0, 0);
            ref.current?.scrollIntoView({ behavior: 'instant', block: 'end', inline: 'end' });
            navigate(location.pathname, { replace: true });
        }
    }, []);

    if (tilgangInntektsmelding) {
        return (
            <div
                ref={ref}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    paddingBottom: '32px',
                }}
            >
                <Label
                    htmlFor="opprett-inntektsmelding-lenke-id"
                    children="Opprett inntektsmelding manuelt"
                />
                <LenkeMedLogging
                    id="opprett-inntektsmelding-lenke-id"
                    loggLenketekst={'Opprett inntektsmelding manuelt'}
                    href={opprettInntektsmeldingURL}
                >
                    Opprett inntektsmelding for sykepenger
                </LenkeMedLogging>
            </div>
        );
    } else {
        return null;
    }
};
