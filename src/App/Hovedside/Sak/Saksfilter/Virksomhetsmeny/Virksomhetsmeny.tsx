import React, { forwardRef, ReactNode, useContext, useMemo, useState } from 'react';
import { CheckboxGroup, Search } from '@navikt/ds-react';
import './Virksomhetsmeny.css';
import { UnderenhetCheckboks } from './UnderenhetCheckboks';
import { HovedenhetCheckbox } from './HovedenhetCheckbox';
import fuzzysort from 'fuzzysort';
import { sum } from '../../../../../utils/util';
import amplitude from '../../../../../utils/amplitude';
import { Map, Set } from 'immutable';
import { OrganisasjonerOgTilgangerContext } from '../../../../OrganisasjonerOgTilgangerProvider';

export type VirksomhetsmenyProps = {
    valgteEnheter: Set<string>,
    setValgteEnheter: (enheter: Set<string>) => void,
}

export const Virksomhetsmeny = ({ valgteEnheter: valgteEnheterInput, setValgteEnheter}: VirksomhetsmenyProps) => {
    const {organisasjonstre, childrenMap} = useContext(OrganisasjonerOgTilgangerContext)
    const alleOrganisasjoner = useMemo(
        () => organisasjonstre.flatMap(({hovedenhet, underenheter}) =>
            // Put elements in same order as their visual order, so it can be used for array navigation
            [hovedenhet, ... underenheter]),
        [organisasjonstre]
    )

    const parentMap = useMemo(
        () => Map(
            organisasjonstre.flatMap(({hovedenhet, underenheter}): [string, string][] =>
                underenheter.map(it => [it.OrganizationNumber, hovedenhet.OrganizationNumber])
            )
        ),
        [organisasjonstre]
    )

    const parentsOf = (orgnr: Set<string>): Set<string> =>
        orgnr.flatMap(it => {
                const x = parentMap.get(it)
                return x === undefined ? [] : [x]
            }
        );

    const valgteEnheter = useMemo(
        () => valgteEnheterInput.union(parentsOf(valgteEnheterInput)),
        [valgteEnheterInput, parentMap]
    )

    const [søketreff, setSøketreff] = useState<undefined | Set<string>>(undefined);

    const amplitudeValgteVirksomheter = (valgte: Set<string>) => {
        amplitude.logEvent("velg-virksomheter", {
            antallHovedenheterValgt: valgte.count(orgnr => childrenMap.has(orgnr)),
            antallHovedenheterTotalt: alleOrganisasjoner.length,
            antallUnderenheterValgt: valgte.count(orgnr => parentMap.has(orgnr)),
            antallUnderenheterTotalt: sum(organisasjonstre, hovedenhet => hovedenhet.underenheter.length),
        })
    };

    const utledNyeValgte = (nyeValgte: Set<string>): Set<string> => {
        // NOTE:
        // Hvis man un-checker en hovedenhet, så forsvinner check-box-ene
        // til underenhetene i GUI-et. Men de blir fjernet som en konsekvens av
        // effekten til denne handleren, så i dette kallet vil underenhetene fortsatt
        // være i `checkedElement`. Det er først i senere kall at de vil ha forsvunnet
        // fra listen.
        const fjernedeHovedenheter = valgteEnheter.subtract(nyeValgte)
            .filter(it => parentMap.get(it) === undefined)

        const implisittFjernedUnderenehter: Set<string> = fjernedeHovedenheter.flatMap(it =>
            childrenMap.get(it) ?? Set<string>()
        )

        // NOTE:
        // På grunn av søk, så er det mulig å klikke på underenheter
        // uten at hovedenhet er huket av.
        const lagtTil = nyeValgte.subtract(valgteEnheter)
        const implisittValgteHovedenheter = parentsOf(lagtTil);

        return nyeValgte
            .subtract(implisittFjernedUnderenehter)
            .union(implisittValgteHovedenheter)
    }

    const onSearchChange = (søkeord: string) => {
        if (søkeord.trim().length === 0) {
            setSøketreff(undefined)
        } else {
            // noinspection JSVoidFunctionReturnValueUsed,TypeScriptValidateTypes
            const fuzzyResultsNavn = fuzzysort.go(søkeord, alleOrganisasjoner, {keys: ['Name', "OrganizationNumber"]});
            const matches = Set(fuzzyResultsNavn.map(({ obj }) => obj.OrganizationNumber))
            const parents = matches.flatMap(it => {
                const parent = parentMap.get(it)
                if (parent === undefined) {
                    return []
                } else {
                    return [parent]
                }
            })
            setSøketreff(matches.union(parents));
        }
    }

    const onCheckboxGroupChange = (checkedEnheter: string[]) => {
        const nyveValgte = utledNyeValgte(Set<string>(checkedEnheter))
        setValgteEnheter(nyveValgte)
        amplitudeValgteVirksomheter(nyveValgte)
    }

    return (<>
        <Søkeboks onChange={onSearchChange} />
        <CheckboxGroup
            legend="Velg virksomheter"
            hideLegend
            value={valgteEnheter.toArray()}
            onChange={onCheckboxGroupChange}
        >
            {
                organisasjonstre.map(({hovedenhet, underenheter}) => {
                        if (søketreff && !søketreff.has(hovedenhet.OrganizationNumber)) {
                            return null
                        }
                        return <div key={hovedenhet.OrganizationNumber}>
                            <HovedenhetCheckbox
                                hovedenhet={hovedenhet}
                                valgteOrgnr={valgteEnheter}
                            />
                            <Conditionally
                                when={valgteEnheter.has(hovedenhet.OrganizationNumber) || (søketreff !== undefined && underenheter.some(it => søketreff.has(it.OrganizationNumber)))}
                            >
                                { underenheter.flatMap((underenhet) => {
                                        if (søketreff && !søketreff.has(underenhet.OrganizationNumber)) {
                                            return []
                                        }

                                        return [<UnderenhetCheckboks
                                            valgteOrgnr={valgteEnheter}
                                            key={underenhet.OrganizationNumber}
                                            underenhet={underenhet}
                                        />]
                                    }
                                )}
                            </Conditionally>
                        </div>
                    }
                )}
        </CheckboxGroup>
    </>)
}

type ConditionallyProps = {
    when: boolean;
    children: ReactNode;
}
export const Conditionally = ({when, children}: ConditionallyProps) =>
    when ? <>{children}</> : null

type SøkeboksProps = {
    onChange: (text: string) => void;
}
const Søkeboks = ({onChange}:SøkeboksProps) =>
    <div className="sak_virksomhetsmeny_sok" >
        <Search
            label="Søk etter virksomhet"
            variant="simple"
            onChange={onChange}
        />
    </div>
