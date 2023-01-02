import React, {useState} from "react";
import "./Saksfilter.css"
import {BodyShort, Button, Checkbox, CheckboxGroup, Search, Select} from "@navikt/ds-react";
import {Collapse, Expand} from "@navikt/ds-icons";
import {Virksomhetsmeny} from "./Virksomhetsmeny/Virksomhetsmeny";
import VirksomhetChips from "./VirksomhetChips";

const alleVirksomheter = [{name: "Athea viken", orgnr: "910 456 900",},
    {name: "Saltrød og Høneby", orgnr: "999 911 111", antall: "30"},
    {name: "NAV ENGERDAL", orgnr: "991 311 111"},
    {name: "NAV HØNEBY", orgnr: "991 311 112"},
    {name: "NAV SALTRØD", orgnr: "991 311 113"},
    {name: "NAV SØR-ODAL", orgnr: "991 311 114"},
    {name: "NAV VEST-ODAL", orgnr: "991 311 115"},
    {name: "NAV ØST-ODAL", orgnr: "991 311 116"},
]


export const Saksfilter = () => {
    const [virksomheter, setVirksomheter] = useState(alleVirksomheter)
    const [typevalgApen, setTypevalgApen] = useState(true)

    const fjernVirksomhet = (virksomhet: any) => {
        setVirksomheter(virksomheter.filter((i: any) => i !== virksomhet))
    }

    function handleChangeTypeSak(val: any[]) {
        return null
    }


    return <div className="saksfilter">

        <Virksomhetsmeny virksomheter={virksomheter} fjernVirksomhet={fjernVirksomhet}>
            <ul className="saksfilter_vis-valgte">
                {virksomheter.map((virksomhet, i) =>
                    <VirksomhetChips
                        key={i}
                        navn={virksomhet.name}
                        orgnr={virksomhet.orgnr}
                        antallUndervirksomheter={virksomhet.antall}
                        onLukk={() => fjernVirksomhet(virksomhet)}
                    />)}
            </ul>
        </Virksomhetsmeny>

        <div className="saksfilter_søk-sak">
            <BodyShort className="saksfilter_headers">Søk blant saker</BodyShort>
            <Search label="Søk alle NAV sine sider" variant="secondary"/>
        </div>

        <div className="saksfilter_type-sak">
            <CheckboxGroup legend={

                <div className="saksfilter_type-sak_header">
                    <BodyShort className="saksfilter_headers">Type saker</BodyShort>
                    <button
                        onClick={() => setTypevalgApen(!typevalgApen)}> {typevalgApen ? <Collapse/> :
                        <Expand/>} </button>
                </div>
            }
                           onChange={(val: any[]) => handleChangeTypeSak(val)}>

                <div className={`saksfiler_type-sak_valg_${typevalgApen ? "åpen" : "lukket"}`}>
                    <Checkbox value="Fritak">Fritak arbeidsgiverperiode (4)</Checkbox>
                    <Checkbox value="Korona">Korona sykdom (10)</Checkbox>
                    <Checkbox value="Lønnskomp">Lønnskompensasjon (23)</Checkbox>
                    <Checkbox value="Refusjon">Refusjon arbeidgsiverperioden (26)</Checkbox>
                    <Checkbox value="Utestengt">Utestengt EØS borger (3)</Checkbox>
                    <Checkbox value="Permittering">Permittering og nedbemmaning (14)</Checkbox>
                </div>
            </CheckboxGroup>
        </div>

        <Select label="Periode" hideLabel>
            <option value={12}> Siste 12 måneder</option>
        </Select>
    </div>
}
