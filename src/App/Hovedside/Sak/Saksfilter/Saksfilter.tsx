import React, {useState} from "react";
import "./Saksfilter.css"
import {BodyShort, Checkbox, CheckboxGroup, Search, Select} from "@navikt/ds-react";
import {Hovedenhet, Underenhet, Virksomhetsmeny} from "./Virksomhetsmeny/Virksomhetsmeny";

const alleVirksomheter: Array<Hovedenhet> = [
    {
        name: "Athea", orgnr: "923456789", valgt: false, søkMatch: false, åpen: false, underenheter: [
            {name: "Athea viken", orgnr: "910 456 900", valgt: false, søkMatch: false,},
            {name: "Athea innlandet", orgnr: "910 456 901", valgt: false, søkMatch: false,},
        ]
    },
    {
        name: "Bergen kommune", orgnr: "910 456 902", valgt: false, åpen: false, søkMatch: false, underenheter: [
            {name: "Saltrød og Høneby", valgt: false, søkMatch: false, orgnr: "999 911 111"},
            {name: "Bergen kommunehus", valgt: false, søkMatch: false, orgnr: "999 911 112"},
        ]
    },
    {
        name: "NAV", orgnr: "919 911 111", valgt: false, åpen: false, søkMatch: false, underenheter: [
            {name: "NAV ENGERDAL", valgt: false, søkMatch: false, orgnr: "991 311 111"},
            {name: "NAV HØNEBY", valgt: false, søkMatch: false, orgnr: "991 311 112"},
            {name: "NAV SALTRØD", valgt: false, søkMatch: false, orgnr: "991 311 113"},
            {name: "NAV SØR-ODAL", valgt: false, søkMatch: false, orgnr: "991 311 114"},
            {name: "NAV VEST-ODAL", valgt: false, søkMatch: false, orgnr: "991 311 115"},
            {name: "NAV ØST-ODAL", valgt: false, søkMatch: false, orgnr: "991 311 116"},
            {name: "NAV ÅS", valgt: false, søkMatch: false, orgnr: "991 311 117"},
            {name: "NAV ÅSANE", valgt: false, søkMatch: false, orgnr: "991 311 118"},
            {name: "NAV ÅSERAL", valgt: false, søkMatch: false, orgnr: "991 311 119"},
            {name: "NAV ÅSUNDSBRED", valgt: false, søkMatch: false, orgnr: "991 311 120"},
        ]
    },
    {
        name: "BB", valgt: false, søkMatch: false, åpen: false, orgnr: "919 911 199", underenheter: [
            {name: "Bil og båt", valgt: false, søkMatch: false, orgnr: "991 311 131"},
            {name: "Båt og bil", orgnr: "991 311 140", valgt: false, søkMatch: false},
        ]
    },
    {
        name: "AB 99", orgnr: "919 911 112", valgt: false, åpen: false, søkMatch: false, underenheter: [
            {name: "Bil og båt", orgnr: "991 312 131", valgt: false, søkMatch: false},
            {name: "Båt og bil", orgnr: "991 312 140", valgt: false, søkMatch: false},
        ]
    },
]


export const Saksfilter = () => {
    const [valgteVirksomheter, setValgteVirksomheter] = useState<Array<Hovedenhet | Underenhet>>([
        {name: "Athea viken", orgnr: "910 456 900", valgt: true, søkMatch: true}, {
            name: "Bergen kommune", orgnr: "910 456 902", valgt: true, søkMatch: true, underenheter: [
                {name: "Saltrød og Høneby", orgnr: "999 911 111", valgt: true, søkMatch: true},
                {name: "Bergen kommunehus", orgnr: "999 911 112", valgt: true, søkMatch: true},
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
