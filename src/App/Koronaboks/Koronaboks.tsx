import React, { FunctionComponent, useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Element from 'nav-frontend-typografi/lib/element';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import {
    lenkeTilPermitteringOgMasseoppsigelsesSkjema,
    permitteringKlageskjemaURL,
    koronaSykeRefusjonURL,
    lenkeTilPermitteringsInfo, lenkeTilLonnskompensasjonOgRefusjon,
    grensekompURL,
    grensekompOversiktURL
} from '../../lenker';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import KoronaboksIkon from './KoronaboksIkon';
import './Koronaboks.less';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';

interface KoronalenkeProps {
    href: string;
}
const Koronalenke: FunctionComponent<KoronalenkeProps> = ({children, href}) =>
    <LenkeMedLogging
        className="koronaboks__lenke"
        href={href}
        loggTjeneste="korona"
    >
        <span>{children}</span>
        <HoyreChevron />
    </LenkeMedLogging>;

export const Koronaboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    return (
        <div className="koronaboks">
            <Innholdsboks classname="koronaboks__innhold">
                <KoronaboksIkon />
                <Undertittel>Koronarelaterte tjenester</Undertittel>

                <Element className="koronaboks__tekst">Permittering</Element>

                <Koronalenke href={lenkeTilPermitteringOgMasseoppsigelsesSkjema}>
                    Varsle NAV om permitteringer, masseoppsigelser eller innskrenkninger i
                    arbeidstiden
                </Koronalenke>

                <Koronalenke href={lenkeTilPermitteringsInfo}>
                    Nye regler for lønnsplikt ved permittering
                </Koronalenke>

                {
                    valgtOrganisasjon?.altinntilgang.inntektsmelding.tilgang === 'ja'
                        ? <LenkerSomKreverInntekstmeldingtilgang orgnr={valgtOrganisasjon.organisasjon.OrganizationNumber} />
                        : null
                }
            </Innholdsboks>
        </div>
    );
};
const LenkerSomKreverInntekstmeldingtilgang: FunctionComponent<{orgnr: string}> = ({orgnr}) => <>

    <Element className="koronaboks__tekst">Lønnskompensasjon</Element>
    <Koronalenke href={lenkeTilLonnskompensasjonOgRefusjon}>
        Se kvittering på innsendt skjema om lønnskompensasjon
    </Koronalenke>
    <Koronalenke href={permitteringKlageskjemaURL(orgnr)}>
        Ettersend opplysninger eller klag på vedtak om lønnskompensasjon
    </Koronalenke>

    <Element className="koronaboks__tekst">Refusjon sykepenger</Element>
    <Koronalenke href={koronaSykeRefusjonURL(orgnr)}>
        Søk om refusjon av sykepenger ved koronavirus
    </Koronalenke>

    <Element className="koronaboks__tekst">Restriksjoner for innreise</Element>
    <Koronalenke href={grensekompURL}>
        Søk om refusjon for utestengte EØS-borgere
    </Koronalenke>

    <Koronalenke href={grensekompOversiktURL}>
        Refusjon for utestengte EØS-borgere - se innsendte krav
    </Koronalenke>
</>;

