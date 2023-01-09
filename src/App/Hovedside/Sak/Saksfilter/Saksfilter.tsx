import React, {useState} from "react";
import "./Saksfilter.css"
import {BodyShort, Checkbox, CheckboxGroup, Search, Select} from "@navikt/ds-react";
import {Hovedenhet, Underenhet, Virksomhetsmeny} from "./Virksomhetsmeny/Virksomhetsmeny";

const alleVirksomheter = [
    {
        name: "Athea", orgnr: "923456789", underenheter: [
            {name: "Athea viken", orgnr: "910 456 900",},
            {name: "Athea innlandet", orgnr: "910 456 901",},
        ]
    },
    {
        name: "Bergen kommune", orgnr: "910 456 902", underenheter: [
            {name: "Saltrød og Høneby", orgnr: "999 911 111"},
            {name: "Bergen kommunehus", orgnr: "999 911 112"},
        ]
    },
    {
        name: "NAV", orgnr: "919 911 111", underenheter: [
            {name: "NAV ENGERDAL", orgnr: "991 311 111"},
            {name: "NAV HØNEBY", orgnr: "991 311 112"},
            {name: "NAV SALTRØD", orgnr: "991 311 113"},
            {name: "NAV SØR-ODAL", orgnr: "991 311 114"},
            {name: "NAV VEST-ODAL", orgnr: "991 311 115"},
            {name: "NAV ØST-ODAL", orgnr: "991 311 116"},
            {name: "NAV ÅS", orgnr: "991 311 117"},
            {name: "NAV ÅSANE", orgnr: "991 311 118"},
            {name: "NAV ÅSERAL", orgnr: "991 311 119"},
            {name: "NAV ÅSUNDSBRED", orgnr: "991 311 120"},
        ]
    },
    {
        name: "BB", orgnr: "919 911 199", underenheter: [
            {name: "Bil og båt", orgnr: "991 311 131"},
            {name: "Båt og bil", orgnr: "991 311 140"},
        ]
    },
    {
        name: "AB 99", orgnr: "919 911 112", underenheter: [
            {name: "Bil og båt", orgnr: "991 312 131"},
            {name: "Båt og bil", orgnr: "991 312 140"},
        ]
    },
]


export const Saksfilter = () => {
    const [valgteVirksomheter, setValgteVirksomheter] = useState<Array<Hovedenhet | Underenhet>>([
        {name: "Athea viken", orgnr: "910 456 900",}, {
            name: "Bergen kommune", orgnr: "910 456 902", underenheter: [
                {name: "Saltrød og Høneby", orgnr: "999 911 111"},
                {name: "Bergen kommunehus", orgnr: "999 911 112"},
            ]
        },
    ])

    return <div className="saksfilter">

        <Virksomhetsmeny alleVirksomheter={alleVirksomheter} valgteVirksomheter={valgteVirksomheter}
                         setValgteVirksomheter={setValgteVirksomheter}/>

        <div className="saksfilter_søk-sak">
            <BodyShort className="saksfilter_headers">Søk blant saker</BodyShort>
            <Search label="Søk alle NAV sine sider" variant="secondary"/>
        </div>

        <div className="saksfilter_type-sak">
            <CheckboxGroup
                legend={<BodyShort className="saksfilter_headers">Type saker</BodyShort>}
                onChange={(val: any[]) => {
                    null
                }}
            >
                <div className={'saksfiler_type-sak_valg_'}>
                    <Checkbox value="Fritak">Fritak arbeidsgiverperiode (4)</Checkbox>
                    <Checkbox value="Korona">Korona sykdom (10)</Checkbox>
                    <Checkbox value="Lønnskomp">Lønnskompensasjon (23)</Checkbox>
                    <Checkbox value="Refusjon">Refusjon arbeidgsiverperioden (26)</Checkbox>
                    <Checkbox value="Utestengt">Utestengt EØS borger (3)</Checkbox>
                    <Checkbox value="Permittering">Permittering og nedbemmaning (14)</Checkbox>
                </div>
            </CheckboxGroup>
        </div>

        <Select label="Periode" hideLabel
                defaultValue={12}>
            <option value={12}> Siste 12 måneder</option>
        </Select>
    </div>
}
