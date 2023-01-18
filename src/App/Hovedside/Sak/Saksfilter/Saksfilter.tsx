import React, {useEffect, useState} from "react";
import * as Sentry from '@sentry/react';
import "./Saksfilter.css"
import {
    BodyShort,
    Checkbox,
    CheckboxGroup,
    Search,
    Select
} from "@navikt/ds-react";
import {
    Organisasjon, OrganisasjonEnhet,
    Virksomhetsmeny
} from "./Virksomhetsmeny/Virksomhetsmeny";
import {byggOrganisasjonstre} from "./ByggOrganisasjonstre";


type SaksfilterProps = {
    valgteVirksomheter: Organisasjon[] | "ALLEBEDRIFTER";
    setValgteVirksomheter: (valgteVirksomheter: Organisasjon[] | "ALLEBEDRIFTER") => void;
    organisasjoner: Organisasjon[];
}

export const Saksfilter = ({valgteVirksomheter, setValgteVirksomheter, organisasjoner}: SaksfilterProps) => {
    const [organisasjonstre, setOrganisasjonstre] = useState<OrganisasjonEnhet[]>()

    useEffect(() => {
        byggOrganisasjonstre(organisasjoner)
            .then(setOrganisasjonstre)
            .catch(Sentry.captureException)
    }, [organisasjoner])

    if (organisasjonstre === undefined) {
        return null
    }

    return <div className="saksfilter">
        <Virksomhetsmeny organisasjonstre={organisasjonstre}
                         valgteEnheter={valgteVirksomheter}
                         settValgteEnheter={setValgteVirksomheter}/>

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
    </div>;
}

