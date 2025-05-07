import React, { ReactNode, useMemo, useState } from 'react';
import { CheckboxGroup, Label, Search } from '@navikt/ds-react';
import './Virksomhetsmeny.css';
import { UnderenhetCheckboks } from './UnderenhetCheckboks';
import { HovedenhetCheckbox } from './HovedenhetCheckbox';
import fuzzysort from 'fuzzysort';
import { flatUtTre, sum } from '../../../../utils/util';
import { Set } from 'immutable';

import { useOrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerContext';
import { useSaksoversiktContext } from '../../SaksoversiktProvider';
import { logAnalyticsEvent } from '../../../../utils/analytics';

export const Virksomhetsmeny = () => {
    const { organisasjonstre, orgnrTilParentMap, orgnrTilChildrenMap } =
        useOrganisasjonerOgTilgangerContext();

    const {
        saksoversiktState: { filter },
        transitions: { setFilter },
    } = useSaksoversiktContext();

    const organisasjonstreFlat = flatUtTre(organisasjonstre);
    const alleOrganisasjoner = organisasjonstreFlat.flatMap((it) => [it, ...it.underenheter]);
    const parentMap = orgnrTilParentMap.filter((parent, _child) =>
        organisasjonstreFlat.some((it) => it.orgnr === parent)
    );
    const childrenMap = orgnrTilChildrenMap.filter((_children, parent) =>
        organisasjonstreFlat.some((it) => it.orgnr === parent)
    );

    const parentsOf = (orgnr: Set<string>): Set<string> =>
        orgnr.flatMap((it) => {
            const x = parentMap.get(it);
            return x === undefined ? [] : [x];
        });

    const valgteEnheter = useMemo(
        () => filter.virksomheter.union(parentsOf(filter.virksomheter)),
        [filter.virksomheter, parentMap]
    );

    const [søketreff, setSøketreff] = useState<undefined | Set<string>>(undefined);

    const amplitudeValgteVirksomheter = (valgte: Set<string>) => {
        logAnalyticsEvent('velg-virksomheter', {
            antallHovedenheterValgt: valgte.count((orgnr) => childrenMap.has(orgnr)),
            antallHovedenheterTotalt: alleOrganisasjoner.length,
            antallUnderenheterValgt: valgte.count((orgnr) => parentMap.has(orgnr)),
            antallUnderenheterTotalt: sum(
                organisasjonstreFlat,
                (hovedenhet) => hovedenhet.underenheter.length
            ),
        });
    };

    const utledNyeValgte = (nyeValgte: Set<string>): Set<string> => {
        // NOTE:
        // Hvis man un-checker en hovedenhet, så forsvinner check-box-ene
        // til underenhetene i GUI-et. Men de blir fjernet som en konsekvens av
        // effekten til denne handleren, så i dette kallet vil underenhetene fortsatt
        // være i `checkedElement`. Det er først i senere kall at de vil ha forsvunnet
        // fra listen.
        const fjernedeHovedenheter = valgteEnheter
            .subtract(nyeValgte)
            .filter((it) => parentMap.get(it) === undefined);

        const implisittFjernedUnderenehter: Set<string> = fjernedeHovedenheter.flatMap(
            (it) => childrenMap.get(it) ?? Set<string>()
        );

        // NOTE:
        // På grunn av søk, så er det mulig å klikke på underenheter
        // uten at hovedenhet er huket av.
        const lagtTil = nyeValgte.subtract(valgteEnheter);
        const implisittValgteHovedenheter = parentsOf(lagtTil);

        return nyeValgte.subtract(implisittFjernedUnderenehter).union(implisittValgteHovedenheter);
    };

    const onSearchChange = (søkeord: string) => {
        if (søkeord.trim().length === 0) {
            setSøketreff(undefined);
        } else {
            // noinspection JSVoidFunctionReturnValueUsed,TypeScriptValidateTypes
            const fuzzyResultsNavn = fuzzysort.go(søkeord, alleOrganisasjoner, {
                keys: ['Name', 'OrganizationNumber'],
            });
            const matches = Set(fuzzyResultsNavn.map(({ obj }) => obj.orgnr));
            const parents = matches.flatMap((it) => {
                const parent = parentMap.get(it);
                if (parent === undefined) {
                    return [];
                } else {
                    return [parent];
                }
            });
            setSøketreff(matches.union(parents));
        }
    };

    const onCheckboxGroupChange = (checkedEnheter: string[]) => {
        const valgteVirksomheter = utledNyeValgte(Set<string>(checkedEnheter));
        setFilter({ ...filter, virksomheter: valgteVirksomheter });
        amplitudeValgteVirksomheter(valgteVirksomheter);
    };

    return (
        <>
            <Label htmlFor="virksomheter_checkbox_group_id"> Virksomheter </Label>
            <Søkeboks onChange={onSearchChange} />
            <CheckboxGroup
                id="virksomheter_checkbox_group_id"
                legend="Velg virksomheter"
                hideLegend
                value={valgteEnheter.toArray()}
                onChange={onCheckboxGroupChange}
            >
                <ul className="sak_virksomhetsmeny_hovedenhetliste">
                    {organisasjonstreFlat.map((hovedenhet) => {
                        const underenheter = hovedenhet.underenheter;
                        if (søketreff && !søketreff.has(hovedenhet.orgnr)) {
                            return null;
                        }
                        return (
                            <li key={hovedenhet.orgnr}>
                                <HovedenhetCheckbox
                                    hovedenhet={hovedenhet}
                                    valgteOrgnr={valgteEnheter}
                                />
                                <Conditionally
                                    when={
                                        valgteEnheter.has(hovedenhet.orgnr) ||
                                        (søketreff !== undefined &&
                                            underenheter.some((it) => søketreff.has(it.orgnr)))
                                    }
                                >
                                    <ul>
                                        {underenheter.flatMap((underenhet) => {
                                            if (søketreff && !søketreff.has(underenhet.orgnr)) {
                                                return [];
                                            }

                                            return [
                                                <li
                                                    key={underenhet.orgnr}
                                                    className="sak_virksomhetsmeny_underenhet"
                                                >
                                                    <UnderenhetCheckboks underenhet={underenhet} />
                                                </li>,
                                            ];
                                        })}
                                    </ul>
                                </Conditionally>
                            </li>
                        );
                    })}
                </ul>
            </CheckboxGroup>
        </>
    );
};

type ConditionallyProps = {
    when: boolean;
    children: ReactNode;
};
export const Conditionally = ({ when, children }: ConditionallyProps) =>
    when ? <>{children}</> : null;

type SøkeboksProps = {
    onChange: (text: string) => void;
};
const Søkeboks = ({ onChange }: SøkeboksProps) => (
    <div className="sak_virksomhetsmeny_sok">
        <Search
            autoComplete="off"
            label="Søk etter virksomhet"
            variant="simple"
            onChange={onChange}
        />
    </div>
);
