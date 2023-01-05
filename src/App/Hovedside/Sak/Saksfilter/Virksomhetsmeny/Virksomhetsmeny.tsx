import React from "react"
import {BodyShort, Button, Checkbox, CheckboxGroup, Search} from "@navikt/ds-react";
import {Expand, Collapse} from "@navikt/ds-icons";
import "./Virksomhetsmeny.css"
import {EkstraChip, VirksomhetChips} from "../VirksomhetChips";
import {UnderenhetCheckboks} from "./UnderenhetCheckboks";
import {HovedenhetCheckbox} from "./HovedenhetCheckbox";

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
    leggtilVirksomhet: (a: Array<Underenhet | Hovedenhet>) => void,
}

export enum forceCheckedEnum {
    FORCECHECKED = "FORCECHECKED",
    FORCEUNCHECKED = "FORCEUNCHECKED",
    NOTFORCED = "NOTFORCED",
}
export const Virksomhetsmeny = ({
                                    alleVirksomheter,
                                    valgteVirksomheter,
                                    fjernVirksomhet,
                                    leggtilVirksomhet
                                }: VirksomhetsmenyProps) => {
    const [virksomhetsmenyÅpen, setVirksomhetsmenyÅpen] = React.useState(false);
    const [forceChecked, setForceChecked] = React.useState<forceCheckedEnum>(forceCheckedEnum.NOTFORCED);

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
                        <Button variant="tertiary">
                            Fjern alle
                        </Button>
                    </div>
                    <CheckboxGroup
                        className="virksomheter_virksomhetsmeny_sok_checkbox"
                        legend="Velg virksomheter"
                        hideLegend
                    >
                        {alleVirksomheter.map((hovedenhet) =>
                            <div key={hovedenhet.orgnr}>
                                <HovedenhetCheckbox hovedenhet={hovedenhet} forceChecked={forceChecked} setForceChecked={setForceChecked}>
                                {
                                    hovedenhet.underenheter.map( ( underenhet) =>
                                        <UnderenhetCheckboks underenhet={underenhet} forceChecked={forceChecked} setForceChecked={setForceChecked}/>
                                    )
                                }
                                </HovedenhetCheckbox>
                            </div>
                        )}
                    </CheckboxGroup>
                    <div className="virksomheter_virksomhetsmeny_footer">
                        <Button> Velg </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setForceChecked(forceCheckedEnum.FORCECHECKED)}
                        > Velg alle </Button>
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
                        antallUndervirksomheter={"underenheter" in virksomhet ? virksomhet.underenheter?.length : 0}
                        onLukk={() => fjernVirksomhet(virksomhet)}
                    />
                    : indeks === 7 ?
                        <EkstraChip antall={valgteVirksomheter.length}/>
                        : null
            )}
        </ul>
    </div>
}