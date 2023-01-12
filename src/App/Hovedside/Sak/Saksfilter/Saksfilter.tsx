import React, {useState} from "react";
import "./Saksfilter.css"
import {BodyShort, Checkbox, CheckboxGroup, Search, Select} from "@navikt/ds-react";
import {
    Hovedenhet,
    Organisasjon,
    OrganisasjonEnhet,
    Underenhet,
    Virksomhetsmeny
} from "./Virksomhetsmeny/Virksomhetsmeny";

const OrganisasjonerResponse: Organisasjon[] = [
    {
        Name: 'En Juridisk Ehhet AS',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '874611111',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811011112',
        ParentOrganizationNumber: '811011111',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '811011111',
        OrganizationForm: 'FLI',
        Status: 'Active',
    },
    {
        Name: 'TEST AV AAFY ',
        Type: 'Business',
        OrganizationNumber: '973611111',
        ParentOrganizationNumber: '971311111',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'NAV ENGERDAL',
        Type: 'Business',
        ParentOrganizationNumber: '874611111',
        OrganizationNumber: '991311111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV HAMAR',
        Type: 'Business',
        ParentOrganizationNumber: '874611111',
        OrganizationNumber: '990211111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BJØRNØYA OG ROVDE REVISJON',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '810911111',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'ARENDAL OG BØNES REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: '810911111',
        OrganizationNumber: '810911121',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'GRAVDAL OG SOLLIA REVISJON',
        Type: 'Business',
        ParentOrganizationNumber: '810911111',
        OrganizationNumber: '910911111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'STORFOSNA OG FREDRIKSTAD REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '910811111',
        OrganizationNumber: '910811311',
        OrganizationForm: 'AAFY',
        Status: 'Active',
    },
    {
        Name: 'TRANØY OG SANDE I VESTFOLD REGNSKAP',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '919811111',
        OrganizationForm: 'FLI',
        Status: 'Active',
    },
    {
        Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910811111',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'SALTRØD OG HØNEBY',
        Type: 'Business',
        OrganizationNumber: '999911111',
        ParentOrganizationNumber: '919811111',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    }
];

const alleVirksomheterToMock: OrganisasjonEnhet[] = OrganisasjonerResponse
    .filter((hovedenhet) => ([null, "", undefined] as any[]).includes(hovedenhet.ParentOrganizationNumber))
    .map(hovedenhet => ({
        juridiskEnhet: hovedenhet,
        organisasjoner: OrganisasjonerResponse.filter(underenhet => underenhet.ParentOrganizationNumber === hovedenhet.OrganizationNumber)
    })
)


export const Saksfilter = () => {
    const [valgteVirksomheter, setValgteVirksomheter] = useState<Organisasjon[] | "ALLEBEDRIFTER">([
        {
            Name: 'BJØRNØYA OG ROVDE REVISJON',
            Type: 'Enterprise',
            ParentOrganizationNumber: null,
            OrganizationNumber: '810911111',
            OrganizationForm: 'AS',
            Status: 'Active',
        },
        {
            Name: 'BALLSTAD OG HAMARØY',
            Type: 'Business',
            OrganizationNumber: '811011112',
            ParentOrganizationNumber: '811011111',
            OrganizationForm: 'AAFY',
            Status: 'Active',
        },
    ])

    return <div className="saksfilter">

        <Virksomhetsmeny organisasjonstre={alleVirksomheterToMock} valgteEnheter={valgteVirksomheter}
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
    </div>
}
