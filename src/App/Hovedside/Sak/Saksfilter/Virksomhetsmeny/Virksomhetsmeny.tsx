import React, { forwardRef, KeyboardEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
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

export type VirksomhetsmenyProps = {
    organisasjonstre: OrganisasjonEnhet[],
    valgteEnheter: Set<string>,
    setValgteEnheter: (enheter: Set<string>) => void,
}

export type OrganisasjonEnhet = {
    hovedenhet: Organisasjon,
    underenheter: Organisasjon[]
}

export type Organisasjon = {
    Name: string,
    Type: string,
    OrganizationNumber: string,
    OrganizationForm: string,
    Status: string,
    ParentOrganizationNumber: string | null,
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
        organisasjonstre,
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
        organisasjonstre={organisasjonstre}
        valgteEnheter={valgteEnheter}
        setValgteEnheter={setValgteEnheter}
    />
}


export interface Underenhet extends Organisasjon {
    valgt: boolean,
    søkMatch: boolean,
}

export interface Hovedenhet extends Organisasjon {
    valgt: boolean,
    søkMatch: boolean,
    underenheter: Array<Underenhet>,
}

type VirksomhetsmenyInternProps = {
    organisasjonstre: OrganisasjonEnhet[],
    valgteEnheter: Set<string>,
    setValgteEnheter: (enheter: Set<string>) => void,
}

const VirksomhetsmenyIntern = ({ organisasjonstre, valgteEnheter: valgteOrgnr, setValgteEnheter}: VirksomhetsmenyInternProps) => {
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
            const pills = []
            for (let {hovedenhet, underenheter} of organisasjonstre) {
                if (valgteOrgnr.has(hovedenhet.OrganizationNumber)) {
                    const antallUnderValgt = count(underenheter, it => valgteOrgnr.has(it.OrganizationNumber))
                    if (antallUnderValgt === 0) {
                        pills.push(hovedenhet)
                    } else {
                        pills.push(... underenheter.filter(it => valgteOrgnr.has(it.OrganizationNumber)))
                    }
                }
            }
            return pills
        },
        [organisasjonstre, valgteOrgnr]
    )

    // TODO: We must normalize the external `valgteOrgnr`, as they might not
    // follow our assumptions that underenhet are checked only if hovedenhet is.
    const [valgteOrgnrIntern, setValgteOrgnrIntern] = useState(valgteOrgnr);
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
        if (søketreff !== undefined && !søketreff.has(orgnr)) {
            return false
        }
        if (valgteOrgnr.has(orgnr)) {
            return true
        }

        const parentOrgnr = parentMap.get(orgnr)
        if (parentOrgnr !== undefined) {
            return valgteOrgnr.has(parentOrgnr)
        }
        return false
    }

    /* TODO: array assumed non-empty below */
    /* TODO: assumes search is not active */
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
        if (valgtEnhet != null) {
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
            setValgteOrgnrIntern(valgteOrgnr)
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
        const implisittValgteHovedenheter: Set<string> =
            lagtTil.flatMap(it => {
                const parent = parentMap.get(it)
                if (parent === undefined) {
                    return []
                }
                return [parent]
            })

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
            // TODO:  oppdaterValgte(alleVirksomheterIntern.map(hovedenhet => {
            // TODO:      if (hovedenhet.OrganizationNumber === valgtEnhet.OrganizationNumber) {
            // TODO:          return {
            // TODO:              ...hovedenhet,
            // TODO:              valgt: !valgtEnhet.valgt,
            // TODO:              underenheter: hovedenhet.underenheter.map(underenhet => ({
            // TODO:                  ...underenhet,
            // TODO:                  valgt: !valgtEnhet.valgt
            // TODO:              }))
            // TODO:          }
            // TODO:      } else {
            // TODO:          const underenheter = hovedenhet.underenheter.map(underenhet =>
            // TODO:              underenhet.OrganizationNumber === valgtEnhet.OrganizationNumber ?
            // TODO:                  {...underenhet, valgt: !valgtEnhet.valgt} :
            // TODO:                  underenhet
            // TODO:          );
            // TODO:          return {
            // TODO:              ...hovedenhet,
            // TODO:              valgt: underenheter.every(underenhet => underenhet.valgt),
            // TODO:              underenheter,
            // TODO:          }
            // TODO:      }
            // TODO:
            // TODO:  }), "lukk")
            event.preventDefault()
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

    const onHovedenhetGåTilForrige = () => {
        // TODO const forrigeIndex = Math.max(0, (alleVirksomheterIntern.indexOf(hovedenhet)) - 1)
        // TODO const forrigeHovedenhet = alleVirksomheterIntern[forrigeIndex];
        // TODO if (forrigeHovedenhet === hovedenhet) {
        // TODO     return
        // TODO }
        // TODO if (forrigeHovedenhet.valgt && forrigeHovedenhet.underenheter.length > 0) {
        // TODO     setValgtEnhet(forrigeHovedenhet.underenheter[forrigeHovedenhet.underenheter.length - 1])
        // TODO } else {
        // TODO     setValgtEnhet(forrigeHovedenhet)
        // TODO }
    }

    const onHovedenhetGåTilUnderenhet = () => {
        // TODO setValgtEnhet(hovedenhet.underenheter[0])
    }

    const onHovedenhetGåTilNeste = () => {
        // TODO const nesteIndex = Math.min(alleVirksomheterIntern.indexOf(hovedenhet) + 1, alleVirksomheterIntern.length - 1)
        // TODO const nesteHovedenhet = alleVirksomheterIntern[nesteIndex];
        // TODO setValgtEnhet(nesteHovedenhet)
    }

    const onUnderenhetGåTilHovedenhet = (hovedenhet: Organisasjon) => {
        setValgtEnhet(hovedenhet.OrganizationNumber);
    }

    const onUnderenhetGåTilForrige = (hovedenhet: Organisasjon, underenheter: Organisasjon[], idx: number) => {
        if (idx === 0) {
            setValgtEnhet(hovedenhet.OrganizationNumber);
        } else {
            setValgtEnhet(underenheter[idx - 1].OrganizationNumber);
        }
    }
    const onUnderenhetGåTilNeste = () => {
        // TODO: if (idx < underenheter.length - 1) {
        // TODO:     setValgtEnhet(underenheter[idx + 1]);
        // TODO: } else {
        // TODO:     const nesteIndex = Math.min(alleVirksomheterIntern.indexOf(hovedenhet) + 1, alleVirksomheterIntern.length - 1);
        // TODO:     const nesteHovedenhet = alleVirksomheterIntern[nesteIndex];
        // TODO:     if (nesteHovedenhet === hovedenhet) {
        // TODO:         return;
        // TODO:     }
        // TODO:     setValgtEnhet(nesteHovedenhet);
        // TODO: }
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
                                                gåTilForrige={() => onHovedenhetGåTilForrige() }
                                                gåTilNeste={() => onHovedenhetGåTilNeste() }
                                                gåTilUnderenhet={() => onHovedenhetGåTilUnderenhet() }
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
                                                            gåTilHovedenhet={() => onUnderenhetGåTilHovedenhet(hovedenhet) }
                                                            gåTilForrige={ () => onUnderenhetGåTilForrige(hovedenhet, underenheter, idx) }
                                                            gåTilNeste={() => onUnderenhetGåTilNeste() }
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
                            // TODO: antallUndervirksomheter={"underenheter" in virksomhet ? virksomhet.underenheter?.length : null}
                            antallUndervirksomheter={null}
                            onLukk={() => {
                                let valgte = valgteOrgnr.remove(virksomhet.OrganizationNumber);

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
