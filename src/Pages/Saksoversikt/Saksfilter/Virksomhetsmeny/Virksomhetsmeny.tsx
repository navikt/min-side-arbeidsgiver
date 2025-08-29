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
    const {
        organisasjonstre,
        // map av orgnr til dens parent. gitt et orgnr finner man parent
        orgnrTilParentMap,
        // map av orgnr til dens children. gitt et orgnr finner man alle children
        orgnrTilChildrenMap,
    } = useOrganisasjonerOgTilgangerContext();

    const {
        saksoversiktState: { filter },
        transitions: { setFilter },
    } = useSaksoversiktContext();

    // liste av organisasjoner som er parent av løvnoder.
    const parentOrganisasjoner = flatUtTre(organisasjonstre);

    // set av alle orgnr som er parent til minst en løvnode
    const parentOrgnumre = new Set(parentOrganisasjoner.map((it) => it.orgnr));

    // alle parents av løvnoder og dems barn som flat liste: [parent1, childavp1, parent2, childavp2, ...]
    const parentsOgChildrenFlatt = parentOrganisasjoner.flatMap((it) => [it, ...it.underenheter]);

    // map <orgnr, org> av alle orgnummer som er parent
    const parentMap = new Map(
        [...orgnrTilParentMap].filter(([_child, parent]) => parentOrgnumre.has(parent))
    );

    // map <orgnr, org[]> av alle orgnummer som er parent
    const childrenMap = new Map(
        [...orgnrTilChildrenMap].filter(([parent, _children]) => parentOrgnumre.has(parent))
    );

    const parentsOf = (orgnr: Set<string>): Set<string> => {
        const result = new Set<string>();
        for (const it of orgnr) {
            const parent = parentMap.get(it);
            if (parent !== undefined) result.add(parent);
        }
        return result;
    };

    const valgteEnheter = useMemo(
        () => filter.virksomheter.union(parentsOf(filter.virksomheter)),
        [filter.virksomheter, parentMap]
    );

    const [søketreff, setSøketreff] = useState<undefined | Set<string>>(undefined);

    const logAnalyticsValgteVirksomheter = (valgte: Set<string>) => {
        logAnalyticsEvent('velg-virksomheter', {
            antallHovedenheterValgt: valgte.intersection(new Set(childrenMap.keys())).size,
            antallHovedenheterTotalt: parentsOgChildrenFlatt.length,
            antallUnderenheterValgt: valgte.intersection(new Set(parentMap.keys())).size,
            antallUnderenheterTotalt: sum(
                parentOrganisasjoner,
                (hovedenhet) => hovedenhet.underenheter.length
            ),
        });
    };

    const utledNyeValgte = (nyeValgte: Set<string>): Set<string> => {
        // 1. Fjernede hovedenheter = de som var i valgteEnheter, men ikke i nyeValgte
        //    og som ikke har en parent
        // NOTE:
        // Hvis man un-checker en hovedenhet, så forsvinner check-box-ene
        // til underenhetene i GUI-et. Men de blir fjernet som en konsekvens av
        // effekten til denne handleren, så i dette kallet vil underenhetene fortsatt
        // være i `checkedElement`. Det er først i senere kall at de vil ha forsvunnet
        // fra listen.
        const fjernedeHovedenheter = new Set(
            [...valgteEnheter].filter((it) => !nyeValgte.has(it) && parentMap.get(it) === undefined)
        );

        // 2. Implisitt fjernede underenheter = alle barna til fjernede hovedenheter
        const implisittFjernedeUnderenheter = new Set<string>();
        for (const hoved of fjernedeHovedenheter) {
            const children = childrenMap.get(hoved);
            if (children) {
                for (const child of children) {
                    implisittFjernedeUnderenheter.add(child);
                }
            }
        }

        // 3. Lagt til = de som er i nyeValgte, men ikke i valgteEnheter
        // NOTE:
        // På grunn av søk, så er det mulig å klikke på underenheter
        // uten at hovedenhet er huket av.
        const lagtTil = new Set([...nyeValgte].filter((it) => !valgteEnheter.has(it)));

        // 4. Implisitt valgte hovedenheter = alle foreldrene til de nye
        const implisittValgteHovedenheter = parentsOf(lagtTil);

        // 5. Returner:
        //    - nyeValgte, uten de implisitt fjernede underenhetene
        //    - + implisitt valgte hovedenheter
        const resultat = new Set<string>(
            [...nyeValgte].filter((it) => !implisittFjernedeUnderenheter.has(it))
        );
        for (const it of implisittValgteHovedenheter) {
            resultat.add(it);
        }

        // Fjerne duplikater siden concat kan gi dobbelt opp
        return resultat;
    };

    const onSearchChange = (søkeord: string) => {
        if (søkeord.trim().length === 0) {
            setSøketreff(undefined);
        } else {
            const keys: (keyof Organisasjon)[] = ['navn', 'orgnr'];
            const fuzzyResultsNavn = fuzzysort.go(søkeord, parentsOgChildrenFlatt, {
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
            setSøketreff(new Set([...matches, ...parents]));
        }
    };

    const onCheckboxGroupChange = (checkedEnheter: string[]) => {
        const valgteVirksomheter = utledNyeValgte(new Set(checkedEnheter));
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
                value={[...valgteEnheter]}
                onChange={onCheckboxGroupChange}
            >
                <ul className="sak_virksomhetsmeny_hovedenhetliste">
                    {parentOrganisasjoner.map((hovedenhet) => {
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
