import React, {useMemo, useState} from "react"
import {BodyShort, Button, CheckboxGroup, Search} from "@navikt/ds-react";
import {Collapse, Expand} from "@navikt/ds-icons";
import "./Virksomhetsmeny.css"
import {EkstraChip, VirksomhetChips} from "../VirksomhetChips";
import {UnderenhetCheckboks} from "./UnderenhetCheckboks";
import {HovedenhetCheckbox} from "./HovedenhetCheckbox";
import * as Record from "../../../../../utils/Record";
import fuzzysort from 'fuzzysort';

export type Underenhet = {
    name: string,
    orgnr: string,
}

export type Hovedenhet = {
    name: string,
    orgnr: string,
    underenheter: Array<Underenhet>,
}

type VirksomhetsmenyProps = {
    alleVirksomheter: Array<Hovedenhet>,
    valgteVirksomheter: Array<Underenhet | Hovedenhet>,
    setValgteVirksomheter: (a: Array<Underenhet | Hovedenhet>) => void,
}

const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
    React.useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}


export const Virksomhetsmeny = ({
                                    alleVirksomheter,
                                    valgteVirksomheter,
                                    setValgteVirksomheter
                                }: VirksomhetsmenyProps) => {

    const [virksomhetsmenyÅpen, setVirksomhetsmenyÅpen] = useState(false);
    const [søkeord, setSøkeord] = useState("");

    const filtrerteVirksomheter = useMemo(() => {
        if (søkeord.length === 0) {
            return alleVirksomheter;
        }
        const flatArrayAlleEnheter = alleVirksomheter.flatMap(hovedenhet => [hovedenhet, ...hovedenhet.underenheter]);
        const fuzzyResultsNavn = fuzzysort.go(søkeord, flatArrayAlleEnheter, {keys: ['name', "orgnr"]});
        const fuzzyResultsUnique = new Set(fuzzyResultsNavn.map(({obj}) => obj));
        return alleVirksomheter.map(hovedenhet => {
            const underenheterResultat = hovedenhet.underenheter.filter(underenhet => fuzzyResultsUnique.has(underenhet));
            return {
                ...hovedenhet,
                underenheter: underenheterResultat
            }
        }).filter(hovedenhet => hovedenhet.underenheter.length > 0 || fuzzyResultsUnique.has(hovedenhet));
    }, [søkeord, alleVirksomheter])


    const [valgteEnheter, setValgteEnheter] = React.useState<Record<string, boolean | undefined>>(
        () => {
            const entries: [string, boolean][] = []
            alleVirksomheter.forEach(enhet => {
                enhet.underenheter.forEach(underenhet => {
                    entries.push([
                        underenhet.orgnr,
                        valgteVirksomheter.some(org => org.orgnr === underenhet.orgnr || org.orgnr === enhet.orgnr)
                    ])
                })
                entries.push([enhet.orgnr, valgteVirksomheter.some(org => org.orgnr === enhet.orgnr)])
            })
            return Record.fromEntries(entries)
        })
    const virksomhetsmenyRef = React.useRef<HTMLDivElement>(null);
    useOnClickOutside(virksomhetsmenyRef, () => oppdaterValgte(valgteEnheter, "lukk"));

    function settAlleTil(valgt: boolean): Record<string, boolean | undefined> {
        const entries: [string, boolean][] = []
        alleVirksomheter.forEach(enhet => {
            enhet.underenheter.forEach(underenhet => {
                entries.push([underenhet.orgnr, valgt])
            })
            entries.push([enhet.orgnr, valgt])
        })
        return Record.fromEntries(entries)
    }

    function oppdaterValgte(valgte: Record<string, boolean | undefined>, commit: "lukk" | "forbliÅpen") {
        setValgteEnheter(valgte)
        if (commit === "lukk") {
            setValgteVirksomheter(
                alleVirksomheter.flatMap<Underenhet | Hovedenhet>(hovedenhet => {
                    if (valgte[hovedenhet.orgnr] === true) {
                        return [hovedenhet]
                    } else {
                        return hovedenhet.underenheter.filter(underenhet => valgte[underenhet.orgnr])
                    }
                }))
            setVirksomhetsmenyÅpen(false)
        }
    }


    return <div className="virksomheter">
        <div className="virksomheter_container" ref={virksomhetsmenyRef}>
            <button
                className="virksomheter_menyknapp"
                onClick={() => {
                    if (virksomhetsmenyÅpen) {
                        oppdaterValgte(valgteEnheter, "lukk")
                    } else {
                        setVirksomhetsmenyÅpen(true)
                    }
                }}
            >
                <BodyShort> Velg virksomheter </BodyShort>
                {virksomhetsmenyÅpen ? <Collapse/> : <Expand/>}
            </button>
            {virksomhetsmenyÅpen ?
                <div className="virksomheter_virksomhetsmeny">
                    <div className="virksomheter_virksomhetsmeny_sok">
                        <Search label="Søk etter virksomhet" variant="simple" onChange={(e) => {
                            setSøkeord(e)
                        }}/>

                    </div>
                    <CheckboxGroup
                        className="virksomheter_virksomhetsmeny_sok_checkbox"
                        legend="Velg virksomheter"
                        hideLegend
                        value={
                            Record.mapToArray(valgteEnheter, (orgnr, valgt: boolean | undefined) => {
                                return (valgt === true) ? [orgnr] : []
                            }).flat(1)
                        }

                        onChange={(e) => {
                            setValgteEnheter(
                                Record.fromEntries(
                                    alleVirksomheter.flatMap(({orgnr, underenheter}): [string, boolean][] => {
                                        const hovedenhetValgt = e.includes(orgnr)

                                        if (hovedenhetValgt !== (valgteEnheter[orgnr] === true)) {
                                            return [
                                                [orgnr, hovedenhetValgt],
                                                ...underenheter.map(({orgnr}): [string, boolean] =>
                                                    [orgnr, hovedenhetValgt]
                                                )
                                            ]
                                        } else {
                                            return [
                                                [orgnr, underenheter.every(underenhet =>
                                                    e.includes(underenhet.orgnr)
                                                )],
                                                ...underenheter.map(({orgnr}): [string, boolean] =>
                                                    [orgnr, e.includes(orgnr)]
                                                )
                                            ]
                                        }
                                    })
                                )
                            )

                        }}
                    >
                        {
                            filtrerteVirksomheter.map((hovedenhet) =>
                                <div key={hovedenhet.orgnr}>
                                    <HovedenhetCheckbox
                                        hovedenhet={hovedenhet}
                                        defaultÅpen={
                                            valgteEnheter[hovedenhet.orgnr] !== true &&
                                            hovedenhet.underenheter.some(underenhet => valgteEnheter[underenhet.orgnr] === true)
                                        }
                                    >
                                        {
                                            hovedenhet.underenheter.map((underenhet) =>
                                                <UnderenhetCheckboks key={underenhet.orgnr} underenhet={underenhet}/>
                                            )
                                        }
                                    </HovedenhetCheckbox>
                                </div>
                            )}
                    </CheckboxGroup>
                    <div className="virksomheter_virksomhetsmeny_footer">
                        <Button
                            onClick={() => {
                                oppdaterValgte(valgteEnheter, "lukk")
                            }}
                        > Velg
                        </Button>
                        <Button
                            onClick={() => {
                                oppdaterValgte(settAlleTil(true), "lukk")
                            }}
                            variant="secondary"
                        > Velg alle </Button>
                        <Button
                            variant="tertiary"
                            onClick={() => {
                                oppdaterValgte(settAlleTil(false), "forbliÅpen")
                            }}
                        >
                            Fjern alle
                        </Button>
                    </div>


                </div> : null}
        </div>
        <ul className="saksfilter_vis-valgte">
            {valgteVirksomheter.map((virksomhet, indeks) =>
                indeks < 7 ?
                    <VirksomhetChips
                        key={virksomhet.orgnr}
                        navn={virksomhet.name}
                        orgnr={virksomhet.orgnr}
                        antallUndervirksomheter={"underenheter" in virksomhet ? virksomhet.underenheter?.length : null}
                        onLukk={() => {
                            const tilstandUtenVirksomhet = Record.map(valgteEnheter, (orgnr, valgt) => {
                                if (orgnr === virksomhet.orgnr) {
                                    return false
                                } else {
                                    return valgt
                                }
                            })
                            if ("underenheter" in virksomhet) {
                                virksomhet.underenheter.forEach(underenhet => {
                                    tilstandUtenVirksomhet[underenhet.orgnr] = false
                                })
                            }
                            oppdaterValgte(tilstandUtenVirksomhet, "lukk")
                        }}
                    />
                    : indeks === 7 ?
                        <EkstraChip key="ekstraUnderenheter" antall={valgteVirksomheter.length}/>
                        : null
            )}
        </ul>
    </div>
}