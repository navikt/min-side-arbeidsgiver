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
import { Søkeboks } from './Søkeboks';
import { Filter } from '../Saksoversikt/useOversiktStateTransitions';


type SaksfilterProps = {
    filter: Filter;
    byttFilter: (filter: Filter) => void;
    organisasjoner: Organisasjon[];
}


export const Saksfilter = ({organisasjoner, filter, byttFilter}: SaksfilterProps) => {
    const [organisasjonstre, setOrganisasjonstre] = useState<OrganisasjonEnhet[]>()

    useEffect(() => {
        byggOrganisasjonstre(organisasjoner)
            .then(setOrganisasjonstre)
            .catch(Sentry.captureException)
    }, [organisasjoner])

    if (organisasjonstre === undefined) {
        return null
    }

    const setValgteVirksomheter = (valgte: Organisasjon[] | "ALLEBEDRIFTER") => {
        byttFilter({...filter, virksomheter: valgte === "ALLEBEDRIFTER" ? organisasjoner : valgte})
    }

    return <div className="saksfilter">
        <Virksomhetsmeny organisasjonstre={organisasjonstre}
                         valgteEnheter={filter.virksomheter}
                         settValgteEnheter={setValgteVirksomheter}/>

        <Søkeboks filter={filter} byttFilter={byttFilter}></Søkeboks>
    </div>;
}

