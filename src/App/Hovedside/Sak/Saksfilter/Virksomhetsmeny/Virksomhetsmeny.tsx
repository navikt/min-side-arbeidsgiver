import React from "react"
import {BodyShort, Button, Search} from "@navikt/ds-react";
import {Expand, Collapse} from "@navikt/ds-icons";
import "./Virksomhetsmeny.css"
import {EkstraChip, VirksomhetChips} from "../VirksomhetChips";

export type underenhet = {
    name: string,
    orgnr: string,
}

export type hovedenhet = {
    name: string,
    orgnr: string,
    underenheter: Array<underenhet>,
}

type VirksomhetsmenyProps = {
    alleVirksomheter: Array<hovedenhet>,
    valgteVirksomheter: Array<underenhet | hovedenhet>,
    fjernVirksomhet: (a: underenhet | hovedenhet) => void,
    leggtilVirksomhet: (a: Array<underenhet | hovedenhet>) => void,
}
export const Virksomhetsmeny = ({
                                    alleVirksomheter,
                                    valgteVirksomheter,
                                    fjernVirksomhet,
                                    leggtilVirksomhet
                                }: VirksomhetsmenyProps) => {
    const [virksomhetsmenyÅpen, setVirksomhetsmenyÅpen] = React.useState(false);

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
                    <ul className="virksomheter_virksomhetsmeny_sok_liste">
                        {alleVirksomheter.map((hovedenhet, index) =>
                            <li key={index}>
                                <div className="virksomheter_virksomhetsmeny_sok_liste_hovedenhet">
                                    {hovedenhet.name}
                                </div>
                            </li>
                        )}
                    </ul>
                    <div className="virksomheter_virksomhetsmeny_footer">
                    <Button> Velg </Button>
                        <Button variant="secondary"> Velg alle </Button>
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