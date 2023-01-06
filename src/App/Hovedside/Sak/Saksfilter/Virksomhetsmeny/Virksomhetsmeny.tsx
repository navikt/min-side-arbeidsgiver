import React from "react"
import {BodyShort, Button, CheckboxGroup, Search} from "@navikt/ds-react";
import {Expand, Collapse} from "@navikt/ds-icons";
import "./Virksomhetsmeny.css"
import {EkstraChip, VirksomhetChips} from "../VirksomhetChips";
import {UnderenhetCheckboks} from "./UnderenhetCheckboks";
import {HovedenhetCheckbox} from "./HovedenhetCheckbox";
import * as Record from "../../../../../utils/Record";

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
    fjernVirksomhet: (a: Underenhet | Hovedenhet) => void,
    setValgteVirksomheter: (a: Array<Underenhet | Hovedenhet>) => void,
}


export const Virksomhetsmeny = ({
                                    alleVirksomheter,
                                    valgteVirksomheter,
                                    fjernVirksomhet,
                                    setValgteVirksomheter
                                }: VirksomhetsmenyProps) => {

    const [virksomhetsmenyÅpen, setVirksomhetsmenyÅpen] = React.useState(false);
    const [valgteEnheter, setValgteEnheter] = React.useState<Record<string, boolean | undefined>>(
        () => {
            const entries: [string, boolean][] = []
            alleVirksomheter.forEach(enhet => {
                enhet.underenheter.forEach(underenhet => {
                    entries.push([underenhet.orgnr, valgteVirksomheter.some(org => org.orgnr === underenhet.orgnr)])
                })
                entries.push([enhet.orgnr, valgteVirksomheter.some(org => org.orgnr === enhet.orgnr)])
            })
            return Record.fromEntries(entries)
        })


    function velgOgLukk() {
        setValgteVirksomheter(
            alleVirksomheter.flatMap<Underenhet | Hovedenhet>(hovedenhet => {
                if (valgteEnheter[hovedenhet.orgnr] === true) {
                    return [hovedenhet]
                } else {
                    return hovedenhet.underenheter.filter(underenhet => valgteEnheter[underenhet.orgnr])
                }
            }))
        setVirksomhetsmenyÅpen(false)
    }

    return <div className="virksomheter">
        <div className="virksomheter_container">
            <button
                className="virksomheter_menyknapp"
                onClick={() => setVirksomhetsmenyÅpen(!virksomhetsmenyÅpen)}>
                <BodyShort> Velg virksomheter </BodyShort>
                {virksomhetsmenyÅpen ? <Collapse/> : <Expand/>}
            </button>
            {virksomhetsmenyÅpen ?
                <div className="virksomheter_virksomhetsmeny">
                    <div className="virksomheter_virksomhetsmeny_sok">
                        <Search label="Søk etter virksomhet" variant="simple"/>

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
                                        if (e.includes(orgnr) && (valgteEnheter[orgnr] !== true)) {
                                            return [[orgnr, true], ...underenheter.map(({orgnr}): [string, boolean] =>
                                                [orgnr, true]
                                            )]
                                        } else if (!e.includes(orgnr) && valgteEnheter[orgnr] === true) {
                                            return [[orgnr, false], ...underenheter.map(({orgnr}): [string, boolean] =>
                                                [orgnr, false]
                                            )]
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
                        {alleVirksomheter.map((hovedenhet) =>
                            <div key={hovedenhet.orgnr}>
                                <HovedenhetCheckbox hovedenhet={hovedenhet}>
                                    {
                                        hovedenhet.underenheter.map((underenhet) =>
                                            <UnderenhetCheckboks underenhet={underenhet}/>
                                        )
                                    }
                                </HovedenhetCheckbox>
                            </div>
                        )}
                    </CheckboxGroup>
                    <div className="virksomheter_virksomhetsmeny_footer">
                        <Button
                            onClick={() => {
                                velgOgLukk();
                            }}
                        > Velg
                        </Button>
                        <Button
                            onClick={() => {
                                setValgteEnheter( () => {
                                    const entries: [string, boolean][] = []
                                    alleVirksomheter.forEach(enhet => {
                                        enhet.underenheter.forEach(underenhet => {
                                            entries.push([underenhet.orgnr, true])
                                        })
                                        entries.push([enhet.orgnr, true])
                                    })
                                    return Record.fromEntries(entries)
                                })
                                velgOgLukk()
                            }}
                            variant="secondary"
                        > Velg alle </Button>
                        <Button
                            variant="tertiary"
                            onClick={() => {
                                setValgteEnheter( () => {
                                    const entries: [string, boolean][] = []
                                    alleVirksomheter.forEach(enhet => {
                                        enhet.underenheter.forEach(underenhet => {
                                            entries.push([underenhet.orgnr, false])
                                        })
                                        entries.push([enhet.orgnr, false])
                                    })
                                    return Record.fromEntries(entries)
                                })
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
                            fjernVirksomhet(virksomhet)
                            const foo = Record.map(valgteEnheter, (orgnr, valgt) => {
                                if (orgnr === virksomhet.orgnr) {
                                    return false
                                } else {
                                    return valgt
                                }
                            })
                            if ("underenheter" in virksomhet) {
                                virksomhet.underenheter.forEach(underenhet => {
                                    foo[underenhet.orgnr] = false
                                })
                            }
                            setValgteEnheter(foo)
                        }}
                    />
                    : indeks === 7 ?
                        <EkstraChip antall={valgteVirksomheter.length}/>
                        : null
            )}
        </ul>
    </div>
}