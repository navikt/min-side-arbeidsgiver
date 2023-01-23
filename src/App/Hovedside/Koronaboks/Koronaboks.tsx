import React, {FunctionComponent, useContext} from 'react';
import {OrganisasjonsDetaljerContext} from '../../OrganisasjonDetaljerProvider';
import {
    permitteringKlageskjemaURL,
    koronaSykeRefusjonURL,
    lenkeTilLonnskompensasjonOgRefusjon
} from '../../../lenker';
import KoronaboksIkon from './KoronaboksIkon';
import './Koronaboks.css';
import {LenkeMedLogging} from '../../../GeneriskeElementer/LenkeMedLogging';
import {Ekspanderbartpanel} from '../../../GeneriskeElementer/Ekspanderbartpanel';
import {HoyreChevron} from "../../../GeneriskeElementer/HoyreChevron";
import {Label} from "@navikt/ds-react";

interface KoronalenkeProps {
    href: string;
    tekst: string;
}

const Koronalenke: FunctionComponent<KoronalenkeProps> = ({href, tekst}) =>
    <LenkeMedLogging
        className='koronaboks__lenke'
        href={href}
        loggLenketekst={tekst}
    >
        <span>{tekst}</span>
        <HoyreChevron/>
    </LenkeMedLogging>;

export const Koronaboks = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined || !valgtOrganisasjon.altinntilgang.inntektsmelding) {
        return null
    }

    const orgnr = valgtOrganisasjon.organisasjon.OrganizationNumber
    return (<Ekspanderbartpanel tittel="Koronaspesifikke tjenester"
                                ikon={<KoronaboksIkon/>}
        >
                <span className='koronaboks__innhold'>
                    <Label  className='koronaboks__tekst'>Lønnskompensasjon</Label>
                    <Koronalenke
                        href={lenkeTilLonnskompensasjonOgRefusjon}
                        tekst='Se kvittering på innsendt skjema om lønnskompensasjon'
                    />

                    <Koronalenke
                        href={permitteringKlageskjemaURL(orgnr)}
                        tekst='Ettersend opplysninger eller klag på vedtak om lønnskompensasjon'
                    />
                </span>
        </Ekspanderbartpanel>
    );
};

