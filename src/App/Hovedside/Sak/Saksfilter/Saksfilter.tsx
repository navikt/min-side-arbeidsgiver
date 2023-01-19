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
    setFilter: (filter: Filter) => void;
    valgteVirksomheter: Organisasjon[] | "ALLEBEDRIFTER";
    setValgteVirksomheter: (valgteVirksomheter: Organisasjon[] | "ALLEBEDRIFTER") => void;
    organisasjoner: Organisasjon[];
}


export const Saksfilter = ({valgteVirksomheter, setValgteVirksomheter, organisasjoner, filter, setFilter}: SaksfilterProps) => {
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

        <Søkeboks filter={filter} byttFilter={setFilter}></Søkeboks>
    </div>;
}

