import React, { ReactNode, useMemo, useState } from 'react';
import { CheckboxGroup, Label, Search } from '@navikt/ds-react';
import './Virksomhetsmeny.css';
import { UnderenhetCheckboks } from './UnderenhetCheckboks';
import { HovedenhetCheckbox } from './HovedenhetCheckbox';
import fuzzysort from 'fuzzysort';
import { flatUtTre, sum } from '../../../../utils/util';
import amplitude from '../../../../utils/amplitude';
import { Set } from 'immutable';

import { useOrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerContext';

export type VirksomhetsmenyProps = {
    valgteEnheter: Set<string>;
    setValgteEnheter: (enheter: Set<string>) => void;
};

export const Virksomhetsmeny = ({
    valgteEnheter: valgteEnheterInput,
    setValgteEnheter,
}: VirksomhetsmenyProps) => {
    const { organisasjonstre, parentMap, childrenMap } = useOrganisasjonerOgTilgangerContext();
    const alleOrganisasjoner = useMemo(
        () => flatUtTre(organisasjonstre).flatMap((it) => [it, ...it.underenheter]),
        [organisasjonstre]
    );

    const parentsOf = (orgnr: Set<string>): Set<string> =>
        orgnr.flatMap((it) => {
            const x = parentMap.get(it);
            return x === undefined ? [] : [x];
        });

    const valgteEnheter = useMemo(
        () => valgteEnheterInput.union(parentsOf(valgteEnheterInput)),
        [valgteEnheterInput, parentMap]
    );

    const [søketreff, setSøketreff] = useState<undefined | Set<string>>(undefined);

    const amplitudeValgteVirksomheter = (valgte: Set<string>) => {
        amplitude.logEvent('velg-virksomheter', {
            antallHovedenheterValgt: valgte.count((orgnr) => childrenMap.has(orgnr)),
            antallHovedenheterTotalt: alleOrganisasjoner.length,
            antallUnderenheterValgt: valgte.count((orgnr) => parentMap.has(orgnr)),
            antallUnderenheterTotalt: sum(
                organisasjonstre,
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
        const nyveValgte = utledNyeValgte(Set<string>(checkedEnheter));
        setValgteEnheter(nyveValgte);
        amplitudeValgteVirksomheter(nyveValgte);
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
                    {organisasjonstre.map((hovedenhet) => {
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
