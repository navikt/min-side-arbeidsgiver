import React, { ReactNode, useContext, useMemo, useState } from 'react';
import { Button, Chips } from '@navikt/ds-react';
import { oppgaveTilstandTilTekst } from '../Saksfilter/Saksfilter';
import { VirksomhetChips } from '../Saksfilter/VirksomhetChips';
import { Set } from 'immutable';
import { amplitudeChipClick } from './Saksoversikt';
import { Organisasjon } from '../../../../altinn/organisasjon';
import { count } from '../../../../utils/util';
import { Filter, State } from './useOversiktStateTransitions';
import { OrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerProvider';
import { Collapse, Expand } from '@navikt/ds-icons';

export type FilterChipsProps = {
    state: State,
    byttFilter: (filter: Filter) => void
}

export const FilterChips = ({ state, byttFilter }: FilterChipsProps) => {
    const { organisasjonstre, childrenMap } = useContext(OrganisasjonerOgTilgangerContext);

    const onTømAlleFilter = () => {
        byttFilter({
            side: 1,
            tekstsoek: '',
            virksomheter: Set(),
            sortering: state.filter.sortering,
            sakstyper: [],
            oppgaveTilstand: [],
        });
        amplitudeChipClick('tøm-alle-filtre', 'tøm-falle-filtre');
    };

    const organisasjonerTilChips = useMemo(() => {
            const chips: (Organisasjon & { erHovedenhet: boolean })[] = [];
            for (let { hovedenhet, underenheter } of organisasjonstre) {
                if (state.filter.virksomheter.has(hovedenhet.OrganizationNumber)) {
                    const antallUnderValgt = count(underenheter, it => state.filter.virksomheter.has(it.OrganizationNumber));
                    if (antallUnderValgt === 0) {
                        chips.push({ ...hovedenhet, erHovedenhet: true });
                    } else {
                        chips.push(...
                            underenheter.filter(it => state.filter.virksomheter.has(it.OrganizationNumber))
                                .map(it => ({ ...it, erHovedenhet: false })),
                        );
                    }
                }
            }
            return chips;
        },
        [organisasjonstre, state.filter.virksomheter],
    );
    const { tekstsoek, sakstyper, oppgaveTilstand } = state.filter;

    const handleValgteVirksomheter = (valgte: Set<string>) => {
        byttFilter({ ...state.filter, virksomheter: valgte });
    };

    let chipElements: ReactNode[] = [
        <Chips.Removable key='EmptyAllFilters' onClick={onTømAlleFilter}>Tøm alle filter</Chips.Removable>,
            tekstsoek !== '' ? <Chips.Removable
            variant='neutral'
            key='textSearchChip'
            onClick={() => {
            byttFilter({ ...state.filter, tekstsoek: '' });
            }}
        >
            {`Tekstsøk: «${tekstsoek}»`}
        </Chips.Removable> : null,
        ...sakstyper.map(sakstype =>
            <Chips.Removable
                variant='neutral'
                key={sakstype}
                onClick={() => {
                    byttFilter({ ...state.filter, sakstyper: state.filter.sakstyper.filter(it => it !== sakstype) });
                    amplitudeChipClick('sakstype', sakstype);
                }}
            >{sakstype}</Chips.Removable>,
        ),
        ...oppgaveTilstand.map(oppgavetilstand =>
            <Chips.Removable
                variant='neutral'
                key={oppgavetilstand}
                onClick={() => {
                    byttFilter({
                        ...state.filter,
                        oppgaveTilstand: state.filter.oppgaveTilstand.filter(it => it != oppgavetilstand),
                    });
                    amplitudeChipClick('oppgave', oppgavetilstand);
                }}
            >{oppgaveTilstandTilTekst(oppgavetilstand)}</Chips.Removable>,
        ),
        ...organisasjonerTilChips.map((virksomhet) =>
            <VirksomhetChips
                key={virksomhet.OrganizationNumber}
                navn={virksomhet.Name}
                erHovedenhet={virksomhet.erHovedenhet}
                onLukk={() => {
                    let valgte = state.filter.virksomheter.remove(virksomhet.OrganizationNumber);

                    // om virksomhet.OrganizatonNumber er siste underenhet, fjern hovedenhet også.
                    const parent = virksomhet.ParentOrganizationNumber;
                    const underenheter = childrenMap.get(parent) ?? Set();
                    if (underenheter.every(it => !valgte.has(it))) {
                        valgte = valgte.remove(parent);
                    }
                    handleValgteVirksomheter(valgte);
                    amplitudeChipClick('organisasjon', virksomhet.erHovedenhet ? 'hovedenhet' : 'underenhet');
                }}
            />,
        ),
    ].filter(it => it !== null);
    return <FilterChipsContainer chipElements={chipElements} />;
};

type FilterChipsContainerProps = {
    chipElements: ReactNode[],
}
const FilterChipsContainer = ({ chipElements }: FilterChipsContainerProps) => {
    const [visAlle, setVisAlle] = useState<boolean>(false);
    const maksAntallMinimert = 9;
    const visKnapp = chipElements.length > maksAntallMinimert;

    return <><Chips
        children={
            visAlle ? chipElements : chipElements.slice(0, maksAntallMinimert)
        }></Chips>
        {visKnapp ? <Button
            variant='tertiary'
            onClick={() => {
                setVisAlle(!visAlle);
            }}
            icon={visAlle ? <Collapse /> : <Expand />}
            style={{ maxWidth: '12rem' }}
        >
            {visAlle ? 'Vis færre filter' : 'Vis alle filter'}
        </Button> : null
        }
    </>;
};