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
    const [valgteEnheter, setValgteEnheter] = React.useState<Record<string, boolean>>(
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
                        onChange={(e) => {
                            setValgteEnheter(
                                Record.map(valgteEnheter, (orgnr) => {
                                    return e.includes(orgnr)
                                })
                            )
                        }}

                    >
                        {alleVirksomheter.map((hovedenhet) =>
                            <div key={hovedenhet.orgnr}>
                                <HovedenhetCheckbox hovedenhet={hovedenhet} valgt={valgteEnheter[hovedenhet.orgnr]}>
                                    {
                                        hovedenhet.underenheter.map((underenhet) =>
                                            <UnderenhetCheckboks underenhet={underenhet}
                                                                 valgt={valgteEnheter[underenhet.orgnr]}/>
                                        )
                                    }
                                </HovedenhetCheckbox>
                            </div>
                        )}
                    </CheckboxGroup>
                    <div className="virksomheter_virksomhetsmeny_footer">
                        <Button
                        onClick={() => {
                            console.log("Før setValgteVirksomheter", {setValgteVirksomheter})
                            setValgteVirksomheter(
                                alleVirksomheter.flatMap<Underenhet | Hovedenhet>( hovedenhet => {
                                    if (valgteEnheter[hovedenhet.orgnr]) {
                                        return [hovedenhet]
                                    } else {
                                        return hovedenhet.underenheter.filter(underenhet => valgteEnheter[underenhet.orgnr])
                                    }
                                }))
                            setVirksomhetsmenyÅpen(false)
                            console.log("lukkes ikke! :/")
                        }}
                        > Velg
                        </Button>
                        <Button
                            variant="secondary"
                        > Velg alle </Button>
                        <Button variant="tertiary">
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
                        onLukk={() => fjernVirksomhet(virksomhet)}
                    />
                    : indeks === 7 ?
                        <EkstraChip antall={valgteVirksomheter.length}/>
                        : null
            )}
        </ul>
    </div>
}