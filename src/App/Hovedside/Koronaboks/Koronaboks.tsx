import React, {FunctionComponent, useContext} from 'react';
import Element from 'nav-frontend-typografi/lib/element';
import {OrganisasjonsDetaljerContext} from '../../OrganisasjonDetaljerProvider';
import {
    permitteringKlageskjemaURL,
    koronaSykeRefusjonURL,
    lenkeTilLonnskompensasjonOgRefusjon
} from '../../../lenker';
import KoronaboksIkon from './KoronaboksIkon';
import './Koronaboks.less';
import {LenkeMedLogging} from '../../../GeneriskeElementer/LenkeMedLogging';
import {Ekspanderbartpanel} from '../../../GeneriskeElementer/Ekspanderbartpanel';
import {Undertittel} from "nav-frontend-typografi";
import {HoyreChevron} from "../../../GeneriskeElementer/HoyreChevron";

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
    return (<Ekspanderbartpanel className='koronaboks'
                                tittel={
                                    <Undertittel className={"koronaboks__tittel"}>
                                        {/*<div className={"koronaboks__ikon"}>*/}
                                            <KoronaboksIkon/>
                                        {/*</div>*/}
                                        <span>Koronaspesifikke tjenester</span>
                                    </Undertittel>
                                }>
                <span className='koronaboks__innhold'>
                    <Element className='koronaboks__tekst'>Refusjon sykepenger</Element>
                    <Koronalenke
                        href={koronaSykeRefusjonURL(orgnr)}
                        tekst='Søk om refusjon av sykepenger ved koronavirus'
                    />

                    <Element className='koronaboks__tekst'>Lønnskompensasjon</Element>
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

