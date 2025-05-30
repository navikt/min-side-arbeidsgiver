import React, { ReactNode, useMemo, useState } from 'react';
import { Button, Chips, Heading } from '@navikt/ds-react';
import { filterTypeTilTekst } from './Saksfilter/Saksfilter';
import { VirksomhetChips } from './Saksfilter/VirksomhetChips';
import { Set } from 'immutable';
import { count, flatUtTre } from '../../utils/util';
import { Organisasjon } from '../OrganisasjonerOgTilgangerContext';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { amplitudeChipClick } from '../../utils/analytics';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerContext';
import { useSaksoversiktContext } from './SaksoversiktProvider';

export const FilterChips = () => {
    const { organisasjonstre, orgnrTilChildrenMap, orgnrTilParentMap } =
        useOrganisasjonerOgTilgangerContext();
    const organisasjonstreFlat = flatUtTre(organisasjonstre);

    const {
        saksoversiktState,
        transitions: { setFilter },
    } = useSaksoversiktContext();

    const onTømAlleFilter = () => {
        setFilter({
            side: 1,
            tekstsoek: '',
            virksomheter: Set(),
            sortering: saksoversiktState.filter.sortering,
            sakstyper: [],
            oppgaveFilter: []
        });
        amplitudeChipClick('tøm-alle-filtre', 'tøm-falle-filtre');
    };

    const organisasjonerTilChips: (Organisasjon & { erHovedenhet: boolean })[] = useMemo<
        (Organisasjon & { erHovedenhet: boolean })[]
    >(() => {
        const chips: (Organisasjon & { erHovedenhet: boolean })[] = [];

        for (let { underenheter, ...hovedenhet } of organisasjonstreFlat) {
            if (saksoversiktState.filter.virksomheter.has(hovedenhet.orgnr)) {
                const antallUnderValgt = count(underenheter, (it) =>
                    saksoversiktState.filter.virksomheter.has(it.orgnr)
                );
                if (antallUnderValgt === 0) {
                    chips.push({ underenheter, ...hovedenhet, erHovedenhet: true });
                } else {
                    chips.push(
                        ...underenheter
                            .filter((it) => saksoversiktState.filter.virksomheter.has(it.orgnr))
                            .map((it) => ({ ...it, erHovedenhet: false }))
                    );
                }
            }
        }
        return chips;
    }, [organisasjonstre, saksoversiktState.filter.virksomheter]);
    const { tekstsoek, sakstyper, oppgaveFilter } = saksoversiktState.filter;

    const handleValgteVirksomheter = (valgte: Set<string>) => {
        setFilter({ ...saksoversiktState.filter, virksomheter: valgte });
    };

    const chipElements: ReactNode[] = [
        tekstsoek !== '' ? (
            <Chips.Removable
                variant="neutral"
                key="textSearchChip"
                onClick={() => {
                    setFilter({ ...saksoversiktState.filter, tekstsoek: '' });
                }}
            >
                {`Tekstsøk: «${tekstsoek}»`}
            </Chips.Removable>
        ) : null,
        ...sakstyper.map((sakstype) =>
            sakstype === 'Inntektsmelding_gruppe' ? null : (
                <Chips.Removable
                    variant="neutral"
                    key={sakstype}
                    onClick={() => {
                        const erInntektsmelding = sakstype.includes('Inntektsmelding');
                        const nySakstyper = erInntektsmelding
                            ? sakstyper.filter((it) => it !== 'Inntektsmelding_gruppe')
                            : sakstyper;
                        setFilter({
                            ...saksoversiktState.filter,
                            sakstyper: nySakstyper.filter((it) => it !== sakstype),
                        });
                        amplitudeChipClick('sakstype', sakstype);
                    }}
                >
                    {sakstype}
                </Chips.Removable>
            )
        ),
        ...oppgaveFilter.map((filterType) => (
            <Chips.Removable
                variant="neutral"
                key={filterType}
                onClick={() => {
                    setFilter({
                        ...saksoversiktState.filter,
                        oppgaveFilter: saksoversiktState.filter.oppgaveFilter.filter(
                            (it) => it != filterType
                        ),
                    });
                    amplitudeChipClick('oppgave', filterType);
                }}
            >
                {filterTypeTilTekst(filterType)}
            </Chips.Removable>
        )),
        ...organisasjonerTilChips.map((virksomhet) => (
            <VirksomhetChips
                key={virksomhet.orgnr}
                navn={virksomhet.navn}
                erHovedenhet={virksomhet.erHovedenhet}
                onLukk={() => {
                    let valgte = saksoversiktState.filter.virksomheter.remove(virksomhet.orgnr);

                    // om virksomhet.OrganizatonNumber er siste underenhet, fjern hovedenhet også.
                    const parent = orgnrTilParentMap.get(virksomhet.orgnr);
                    if (parent === undefined) {
                        return;
                    }
                    const underenheter = orgnrTilChildrenMap.get(parent) ?? [];
                    if (underenheter.every((it) => !valgte.has(it))) {
                        valgte = valgte.remove(parent);
                    }
                    handleValgteVirksomheter(valgte);
                    amplitudeChipClick(
                        'organisasjon',
                        virksomhet.erHovedenhet ? 'hovedenhet' : 'underenhet'
                    );
                }}
            />
        )),
    ].filter((it) => it !== null);
    if (chipElements.length !== 0) {
        chipElements.unshift(
            <Heading
                key="valgteFilterHeading"
                level="3"
                size="medium"
                className="saksoversikt__skjult-header-uu"
            >
                Valgte filter
            </Heading>,

            <Chips.Removable key="EmptyAllFilters" onClick={onTømAlleFilter}>
                Tøm alle filter
            </Chips.Removable>
        );
    }

    return <FilterChipsContainer chipElements={chipElements} />;
};

type FilterChipsContainerProps = {
    chipElements: ReactNode[];
};
const FilterChipsContainer = ({ chipElements }: FilterChipsContainerProps) => {
    const [visAlle, setVisAlle] = useState<boolean>(false);
    const maksAntallMinimert = 9;
    const visKnapp = chipElements.length > maksAntallMinimert;

    return (
        <>
            {chipElements.length > 0 ? (
                <Chips
                    key="filterChips"
                    children={visAlle ? chipElements : chipElements.slice(0, maksAntallMinimert)}
                ></Chips>
            ) : null}
            {visKnapp ? (
                <Button
                    key="visAlleFilterKnapp"
                    variant="tertiary"
                    onClick={() => {
                        setVisAlle(!visAlle);
                    }}
                    icon={visAlle ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    style={{ maxWidth: '12rem' }}
                >
                    {visAlle ? 'Vis færre filter' : 'Vis alle filter'}
                </Button>
            ) : null}
        </>
    );
};
