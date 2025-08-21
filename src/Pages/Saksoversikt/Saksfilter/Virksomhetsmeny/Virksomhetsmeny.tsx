import React, { ReactNode, useMemo, useState } from 'react';
import { CheckboxGroup, Label, Search } from '@navikt/ds-react';
import './Virksomhetsmeny.css';
import { UnderenhetCheckboks } from './UnderenhetCheckboks';
import { HovedenhetCheckbox } from './HovedenhetCheckbox';
import fuzzysort from 'fuzzysort';
import { flatUtTre, sum } from '../../../../utils/util';

import { useOrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerContext';
import { useSaksoversiktContext } from '../../SaksoversiktProvider';
import { logAnalyticsEvent } from '../../../../utils/analytics';
import { Organisasjon } from '@navikt/virksomhetsvelger';

export const Virksomhetsmeny = () => {
    const { organisasjonstre, orgnrTilParentMap, orgnrTilChildrenMap } =
        useOrganisasjonerOgTilgangerContext();

    const {
        saksoversiktState: { filter },
        transitions: { setFilter },
    } = useSaksoversiktContext();

    const organisasjonstreFlat = flatUtTre(organisasjonstre);
    const alleOrganisasjoner = organisasjonstreFlat.flatMap((it) => [it, ...it.underenheter]);
    const parentMap = new Map(
        Array.from(orgnrTilParentMap.entries()).filter(([_child, parent]) =>
            organisasjonstreFlat.some((it) => it.orgnr === parent)
        )
    );
    const childrenMap = new Map(
        Array.from(orgnrTilChildrenMap.entries()).filter(([parent, _children]) =>
            organisasjonstreFlat.some((it) => it.orgnr === parent)
        )
    const childrenMap = (() => {
        const map = new Map<string, Organisasjon[]>();
        for (const [parent, children] of orgnrTilChildrenMap.entries()) {
            if (organisasjonstreFlat.some((it) => it.orgnr === parent)) {
                map.set(parent, children);
            }
        }
        return map;
    })();

    const parentsOf = (orgnr: string[]): string[] =>
        orgnr.flatMap((it) => {
            const x = parentMap.get(it);
            return x === undefined ? [] : [x];
        });

    const valgteEnheter = useMemo(
        () => [...new Set([...filter.virksomheter, ...parentsOf(filter.virksomheter)])],
        [filter.virksomheter, parentMap]
    );

    const [søketreff, setSøketreff] = useState<undefined | string[]>(undefined);

    const logAnalyticsValgteVirksomheter = (valgte: string[]) => {
        logAnalyticsEvent('velg-virksomheter', {
            antallHovedenheterValgt: valgte.filter((orgnr) => childrenMap.has(orgnr)).length,
            antallHovedenheterTotalt: alleOrganisasjoner.length,
            antallUnderenheterValgt: valgte.filter((orgnr) => parentMap.has(orgnr)).length,
            antallUnderenheterTotalt: sum(
                organisasjonstreFlat,
                (hovedenhet) => hovedenhet.underenheter.length
            ),
        });
    };

    const utledNyeValgte = (nyeValgte: string[]): string[] => {
        // 1. Fjernede hovedenheter = de som var i valgteEnheter, men ikke i nyeValgte
        //    og som ikke har en parent
        // NOTE:
        // Hvis man un-checker en hovedenhet, så forsvinner check-box-ene
        // til underenhetene i GUI-et. Men de blir fjernet som en konsekvens av
        // effekten til denne handleren, så i dette kallet vil underenhetene fortsatt
        // være i `checkedElement`. Det er først i senere kall at de vil ha forsvunnet
        // fra listen.
        const fjernedeHovedenheter = valgteEnheter
            .filter((it) => !nyeValgte.includes(it))
            .filter((it) => parentMap.get(it) === undefined);

        // 2. Implisitt fjernede underenheter = alle barna til fjernede hovedenheter
        const implisittFjernedeUnderenheter = fjernedeHovedenheter.flatMap(
            (it) => childrenMap.get(it) ?? []
        );

        // 3. Lagt til = de som er i nyeValgte, men ikke i valgteEnheter
        // NOTE:
        // På grunn av søk, så er det mulig å klikke på underenheter
        // uten at hovedenhet er huket av.
        const lagtTil = nyeValgte.filter((it) => !valgteEnheter.includes(it));

        // 4. Implisitt valgte hovedenheter = alle foreldrene til de nye
        const implisittValgteHovedenheter = parentsOf(lagtTil);

        // 5. Returner:
        //    - nyeValgte, uten de implisitt fjernede underenhetene
        //    - + implisitt valgte hovedenheter
        const resultat = nyeValgte
            .filter((it) => !implisittFjernedeUnderenheter.includes(it))
            .concat(implisittValgteHovedenheter);

        // Fjerne duplikater siden concat kan gi dobbelt opp
        return [...new Set(resultat)];
    };

    const onSearchChange = (søkeord: string) => {
        if (søkeord.trim().length === 0) {
            setSøketreff(undefined);
        } else {
            const keys: (keyof Organisasjon)[] = ['navn', 'orgnr'];
            const fuzzyResultsNavn = fuzzysort.go(søkeord, alleOrganisasjoner, {
                keys,
            });
            const matches = [...new Set(fuzzyResultsNavn.map(({ obj }) => obj.orgnr))];
            const parents = matches.flatMap((it) => {
                const parent = parentMap.get(it);
                if (parent === undefined) {
                    return [];
                } else {
                    return [parent];
                }
            });
            setSøketreff([...new Set([...matches, ...parents])]);
        }
    };

    const onCheckboxGroupChange = (checkedEnheter: string[]) => {
        const valgteVirksomheter = utledNyeValgte(checkedEnheter);
        setFilter({ ...filter, virksomheter: valgteVirksomheter });
        logAnalyticsValgteVirksomheter(valgteVirksomheter);
    };

    return (
        <>
            <Label htmlFor="virksomheter_checkbox_group_id"> Virksomheter </Label>
            <Søkeboks onChange={onSearchChange} />
            <CheckboxGroup
                id="virksomheter_checkbox_group_id"
                legend="Velg virksomheter"
                hideLegend
                value={valgteEnheter}
                onChange={onCheckboxGroupChange}
            >
                <ul className="sak_virksomhetsmeny_hovedenhetliste">
                    {organisasjonstreFlat.map((hovedenhet) => {
                        const underenheter = hovedenhet.underenheter;
                        if (søketreff && !søketreff.includes(hovedenhet.orgnr)) {
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
                                        valgteEnheter.includes(hovedenhet.orgnr) ||
                                        (søketreff !== undefined &&
                                            underenheter.some((it) => søketreff.includes(it.orgnr)))
                                    }
                                >
                                    <ul>
                                        {underenheter.flatMap((underenhet) => {
                                            if (
                                                søketreff &&
                                                !søketreff.includes(underenhet.orgnr)
                                            ) {
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
