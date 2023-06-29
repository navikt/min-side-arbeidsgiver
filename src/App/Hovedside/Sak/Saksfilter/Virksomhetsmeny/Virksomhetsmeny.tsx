import React, { forwardRef, KeyboardEvent, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BodyShort, Button, CheckboxGroup, Search } from '@navikt/ds-react';
import { Collapse, Expand } from '@navikt/ds-icons';
import './Virksomhetsmeny.css';
import { UnderenhetCheckboks } from './UnderenhetCheckboks';
import { HovedenhetCheckbox } from './HovedenhetCheckbox';
import fuzzysort from 'fuzzysort';
import { count, sum } from '../../../../../utils/util';
import amplitude from '../../../../../utils/amplitude';
import { useLoggKlikk } from '../../../../../utils/funksjonerForAmplitudeLogging';
import { useKeyboardEvent } from '../../../../hooks/useKeyboardEvent';
import { useOnClickOutside } from '../../../../hooks/UseOnClickOutside';
import { Map, Set } from 'immutable';
import FocusTrap from 'focus-trap-react';
import { EkstraChip, VirksomhetChips } from '../VirksomhetChips';
import { OrganisasjonerOgTilgangerContext } from '../../../../OrganisasjonerOgTilgangerProvider';
import { Organisasjon } from '../../../../../altinn/organisasjon';

export type VirksomhetsmenyProps = {
    valgteEnheter: Set<string>,
    setValgteEnheter: (enheter: Set<string>) => void,
}

/**
 *
 * @param organisasjonstre
 * @param valgteEnheter
 * @param setValgteEnheter
 * @constructor
 */
export const Virksomhetsmeny = (
    {
        valgteEnheter,
        setValgteEnheter,
    }: VirksomhetsmenyProps
) => {
    // Den interne virksomhetsmenyen holder styr på hva som er 'checked'. Det
    // er noe annet enn hva som er *valgt*, for hvis man har huket av for en
    // hovedenhet, men ikke huket av for en underenhet, så skal man se *alle*
    // underenhetene. Men hvis man har huket av for hovedenheten *og* noen
    // underenheter, så skal kun de avhukede underenhetene vises.

    return <VirksomhetsmenyIntern
        valgteEnheter={valgteEnheter}
        setValgteEnheter={setValgteEnheter}
    />
}

type VirksomhetsmenyInternProps = {
    valgteEnheter: Set<string>,
    setValgteEnheter: (enheter: Set<string>) => void,
}


const VirksomhetsmenyIntern = ({ valgteEnheter: valgteOrgnrExternal, setValgteEnheter}: VirksomhetsmenyInternProps) => {
    const {organisasjonstre} = useContext(OrganisasjonerOgTilgangerContext)
    const alleOrganisasjoner = useMemo(
        () => organisasjonstre.flatMap(({hovedenhet, underenheter}) =>
            // Put elements in same order as their visual order, so it can be used for array navigation
            [hovedenhet, ... underenheter]),
        [organisasjonstre]
    )

    const childrenMap = useMemo(
        () => Map(
            organisasjonstre.map(({hovedenhet, underenheter}): [string, Set<string>] =>
                [hovedenhet.OrganizationNumber, Set(underenheter.map(it => it.OrganizationNumber))]
            )
        ),
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

    const pills = useMemo(() => {
            const pills: (Organisasjon & {antallUnderenheter?: number})[] = []
            for (let {hovedenhet, underenheter} of organisasjonstre) {
                if (valgteOrgnrExternal.has(hovedenhet.OrganizationNumber)) {
                    const antallUnderValgt = count(underenheter, it => valgteOrgnrExternal.has(it.OrganizationNumber))
                    if (antallUnderValgt === 0) {
                        pills.push({...hovedenhet, antallUnderenheter: underenheter.length})
                    } else {
                        pills.push(... underenheter.filter(it => valgteOrgnrExternal.has(it.OrganizationNumber)))
                    }
                }
            }
            return pills
        },
        [organisasjonstre, valgteOrgnrExternal]
    )

    const parentsOf = (orgnr: Set<string>): Set<string> =>
        orgnr.flatMap(it => {
                const x = parentMap.get(it)
                return x === undefined ? [] : [x]
            }
        );

    const internalizedValgteOrgnrFromExternal = useMemo(
        () => valgteOrgnrExternal.union(parentsOf(valgteOrgnrExternal)),
        [valgteOrgnrExternal, parentMap]
    )

    const [valgteOrgnrIntern, setValgteOrgnrIntern] = useState(internalizedValgteOrgnrFromExternal)
    const [søketreff, setSøketreff] = useState<undefined | Set<string>>(undefined);
    const [virksomhetsmenyÅpen, setVirksomhetsmenyÅpen] = useState(false);
    const loggVelgKlikk = useLoggKlikk("velg")
    const loggFjernFiltreringKlikk = useLoggKlikk("fjern filtrering")
    const loggVelgUtenforKlikk = useLoggKlikk("velg utenfor")

    const virksomhetsmenyRef = useRef<HTMLInputElement>(null);

    const amplitudeValgteVirksomheter = (valgte: Set<string>) => {
        amplitude.logEvent("velg-virksomheter", {
            antallHovedenheterValgt: valgte.count(orgnr => childrenMap.has(orgnr)),
            antallHovedenheterTotalt: alleOrganisasjoner.length,
            antallUnderenheterValgt: valgte.count(orgnr => parentMap.has(orgnr)),
            antallUnderenheterTotalt: sum(organisasjonstre, hovedenhet => hovedenhet.underenheter.length),
        })
    };

    /* is org visible for user on screen? */
    const isVisible = (orgnr: string) => {
        if (søketreff !== undefined) {
            return søketreff.has(orgnr)
        }

        const parentOrgnr = parentMap.get(orgnr)

        // Underenheter er ikke nødvendigvis synlig
        if (parentOrgnr !== undefined) {
            return valgteOrgnrIntern.has(parentOrgnr)
        }

        return true
    }

    const førsteEnhet = alleOrganisasjoner
        .find(it => isVisible(it.OrganizationNumber))
        ?.OrganizationNumber
    const sisteEnhet = alleOrganisasjoner
        // @ts-ignore
        .findLast(it => isVisible(it.OrganizationNumber))
        ?.OrganizationNumber
    const [valgtEnhet, setValgtEnhet] = useState<string | undefined>(førsteEnhet)
    const enhetRefs: Record<string, HTMLInputElement> = {}

    const setEnhetRef = (id: string, ref: HTMLInputElement) => {
        enhetRefs[id] = ref
    }

    const focusEnhet = () => {
        if (valgtEnhet !== undefined) {
            enhetRefs[valgtEnhet]?.focus()
            enhetRefs[valgtEnhet]?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"})
        }
    }

    useEffect(() => {
        if (virksomhetsmenyÅpen) {
            focusEnhet()
        }
    }, [virksomhetsmenyÅpen, valgtEnhet])

    useOnClickOutside(virksomhetsmenyRef, () => {
        if (virksomhetsmenyÅpen) {
            loggVelgUtenforKlikk()
            lukkMedValg(valgteOrgnrIntern);
        }
    });

    useKeyboardEvent('keydown', virksomhetsmenyRef,(event) => {
        if (event.key === 'Escape') {
            if (virksomhetsmenyÅpen) {
                lukkMedValg(valgteOrgnrIntern);
            }
        }
    })

    const lukkMedValg = (valgte: Set<string>) => {
        setValgtEnhet(førsteEnhet)
        setValgteEnheter(valgte)
        setSøketreff(undefined)
        setValgteOrgnrIntern(valgte)
        setVirksomhetsmenyÅpen(false)
        amplitudeValgteVirksomheter(valgte)
    }

    const onVirksomhetsmenyKnappClick = () => {
        if (virksomhetsmenyÅpen) {
            lukkMedValg(valgteOrgnrIntern)
        } else {
            setValgteOrgnrIntern(internalizedValgteOrgnrFromExternal)
            setValgtEnhet(førsteEnhet)
            setVirksomhetsmenyÅpen(true)
        }
    }


    const utledNyeValgte = (nyeValgte: Set<string>): Set<string> => {
        // NOTE:
        // Hvis man un-checker en hovedenhet, så forsvinner check-box-ene
        // til underenhetene i GUI-et. Men de blir fjernet som en konsekvens av
        // at effekten til denne handleren, så i dette kallet vil underenhetene fortsatt
        // være i `checkedElement`. Det er først i senere kall at de vil ha forsvunnet
        // fra listen.
        const fjernedeHovedenheter = valgteOrgnrIntern.subtract(nyeValgte)
            .filter(it => parentMap.get(it) === undefined)

        const implisittFjernedUnderenehter: Set<string> = fjernedeHovedenheter.flatMap(it =>
            childrenMap.get(it) ?? Set<string>()
        )

        // NOTE:
        // På grunn av søk, så er det mulig å klikke på underenheter
        // uten at hovedenhet er huket av.
        const lagtTil = nyeValgte.subtract(valgteOrgnrIntern)
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

    const onCheckboxGroupKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Home') {
            setValgtEnhet(førsteEnhet)
            event.preventDefault()
        }
        if (event.key === 'End') {
            setValgtEnhet(sisteEnhet)
            event.preventDefault()
        }
        if (event.key === 'Enter') {
            if (valgtEnhet !== undefined) {
                lukkMedValg(utledNyeValgte(valgteOrgnrIntern.add(valgtEnhet)))
            } else {
                lukkMedValg(valgteOrgnrIntern)
            }
            event.preventDefault()
        }
        if (event.key === 'ArrowUp' || event.key === 'Up') {
            let valgtIdx = alleOrganisasjoner.findIndex(it => it.OrganizationNumber === valgtEnhet)
            let idx = valgtIdx - 1

            for ( ; idx >= 0 && !isVisible(alleOrganisasjoner[idx].OrganizationNumber); idx--) {
            }

            if (idx < 0) {
                setValgtEnhet(førsteEnhet)
            } else {
                setValgtEnhet(alleOrganisasjoner[idx].OrganizationNumber)
            }

            event.preventDefault()
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'Down') {
            let valgtIdx = alleOrganisasjoner.findIndex(it => it.OrganizationNumber === valgtEnhet)
            let idx = valgtIdx + 1

            for ( ; idx < alleOrganisasjoner.length && !isVisible(alleOrganisasjoner[idx].OrganizationNumber); idx++) {
            }

            if (idx >= alleOrganisasjoner.length) {
                // valgtEnhet undret, da det allerede er siste synlige
            } else {
                setValgtEnhet(alleOrganisasjoner[idx].OrganizationNumber)
            }

            event.preventDefault()
            return;
        }
    }

    const onCheckboxGroupChange = (checkedEnheter: string[]) => {
        setValgteOrgnrIntern(utledNyeValgte(Set<string>(checkedEnheter)))
    }

    const onVelgButtonClick = () => {
        loggVelgKlikk()
        lukkMedValg(valgteOrgnrIntern)
    }

    const onFjernButtonClick = () => {
        loggFjernFiltreringKlikk()
        setValgteOrgnrIntern(Set())
    }

    return <div className="virksomheter">
        <div className="virksomheter_container" ref={virksomhetsmenyRef}>
            <VirksomhetsmenyKnapp onClick={onVirksomhetsmenyKnappClick} åpen={virksomhetsmenyÅpen} />
            <Conditionally when={virksomhetsmenyÅpen}>
                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}}>
                    <div
                        id="virksomheter_virksomhetsmeny"
                        className="virksomheter_virksomhetsmeny"
                        role="menu"
                    >
                        <Søkeboks onChange={onSearchChange} />
                        <CheckboxGroup
                            className="virksomheter_virksomhetsmeny_sok_checkbox"
                            legend="Velg virksomheter"
                            hideLegend
                            value={valgteOrgnrIntern.toArray()}
                            onKeyDown={onCheckboxGroupKeyDown}
                            onChange={onCheckboxGroupChange}
                        >
                            {
                                organisasjonstre.map(({hovedenhet, underenheter}) => {
                                        if (søketreff && !søketreff.has(hovedenhet.OrganizationNumber)) {
                                            return null
                                        }
                                        return <div key={hovedenhet.OrganizationNumber}>
                                            <HovedenhetCheckbox
                                                setEnhetRef={setEnhetRef}
                                                hovedenhet={hovedenhet}
                                                valgteOrgnr={valgteOrgnrIntern}
                                                tabbable={valgtEnhet === hovedenhet.OrganizationNumber}
                                                antallUnderenheter={underenheter.length}
                                                antallValgteUnderenheter={count(underenheter, it => valgteOrgnrIntern.has(it.OrganizationNumber))}
                                            />
                                            <Conditionally
                                                when={valgteOrgnrIntern.has(hovedenhet.OrganizationNumber) || (søketreff !== undefined && underenheter.some(it => søketreff.has(it.OrganizationNumber)))}
                                            >
                                                { underenheter.flatMap((underenhet, idx) => {
                                                        if (søketreff && !søketreff.has(underenhet.OrganizationNumber)) {
                                                            return []
                                                        }

                                                        return [<UnderenhetCheckboks
                                                            valgteOrgnr={valgteOrgnrIntern}
                                                            setEnhetRef={setEnhetRef}
                                                            key={underenhet.OrganizationNumber}
                                                            underenhet={underenhet}
                                                            tabbable={valgtEnhet === underenhet.OrganizationNumber}
                                                        />]
                                                    }
                                                )}
                                            </Conditionally>
                                        </div>
                                    }
                                )}
                        </CheckboxGroup>
                        <div className="virksomheter_virksomhetsmeny_footer">
                            <Button onClick={onVelgButtonClick}>
                                Velg
                            </Button>
                            <Button
                                variant="tertiary"
                                onClick={onFjernButtonClick}
                            >
                                Fjern filtrering
                            </Button>
                        </div>
                    </div>
                </FocusTrap>
            </Conditionally>
        </div>
        <Conditionally when={pills.length > 0}>
            <ul className="saksfilter_vis-valgte">
                {pills.map((virksomhet, indeks) =>
                    indeks < 3 ?
                        <VirksomhetChips
                            key={virksomhet.OrganizationNumber}
                            navn={virksomhet.Name}
                            orgnr={virksomhet.OrganizationNumber}
                            antallUndervirksomheter={virksomhet.antallUnderenheter ?? null}
                            onLukk={() => {
                                let valgte = valgteOrgnrExternal.remove(virksomhet.OrganizationNumber);

                                // om virksomhet.OrganizatonNumber er siste underenhet, fjern hovedenhet også.
                                const parent = virksomhet.ParentOrganizationNumber
                                if (typeof parent === 'string') {
                                    const underenheter = childrenMap.get(parent) ?? Set()
                                    if (underenheter.every(it => !valgte.has(it))) {
                                        valgte = valgte.remove(parent)
                                    }
                                }
                                setValgteEnheter(valgte)
                            }}
                        />
                        : indeks === 3 ?
                            <EkstraChip key="ekstraUnderenheter" ekstra={pills.length - 3}/>
                            : null
                )}
            </ul>
        </Conditionally>
    </div>
}

type ConditionallyProps = {
    when: boolean;
    children: ReactNode;
}
const Conditionally = ({when, children}: ConditionallyProps) =>
    when ? <>{children}</> : null


type VirksomhetsmenyKnappProps = {
    onClick: () => void;
    åpen: boolean;
}

const VirksomhetsmenyKnapp = ({onClick, åpen}: VirksomhetsmenyKnappProps) =>
    <button
        className="virksomheter_menyknapp"
        aria-haspopup="true"
        aria-controls="virksomheter_virksomhetsmeny"
        onClick={onClick}
    >
        <BodyShort> Velg virksomheter </BodyShort>
        {åpen ? <Collapse aria-hidden={true}/> : <Expand aria-hidden={true}/>}
    </button>

type SøkeboksProps = {
    onChange: (text: string) => void;
}
const Søkeboks = forwardRef<HTMLDivElement, SøkeboksProps>(({onChange}, ref) =>
    <div className="virksomheter_virksomhetsmeny_sok">
        <Search
            ref={ref}
            label="Søk etter virksomhet"
            variant="simple"
            onChange={onChange}
        />
    </div>)
