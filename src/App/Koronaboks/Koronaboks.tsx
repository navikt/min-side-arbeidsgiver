import React, { FunctionComponent, useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Element from 'nav-frontend-typografi/lib/element';
import Lenke from 'nav-frontend-lenker';
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

interface KoronalenkeProps {
    href: string;
}
const Koronalenke: FunctionComponent<KoronalenkeProps> = ({children, href}) =>
    <Lenke className="koronaboks__lenke" href={href}>
        <span>{children}</span>
        <HoyreChevron />
    </Lenke>;

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
    <Koronalenke href={lenkeTilLonnskompensasjonOgRefusjon}>
        Lønnskompensasjon og refusjon for permitterte – se kvittering
    </Koronalenke>

    <Koronalenke href={permitteringKlageskjemaURL(orgnr)}>
        Lønnskompensasjon og refusjon for permitterte – endre opplysninger eller klag på vedtak
    </Koronalenke>

    <Element className="koronaboks__tekst">Refusjon sykepenger</Element>
    <Koronalenke href={koronaSykeRefusjonURL(orgnr)}>
        Søk om refusjon av sykepenger ved koronavirus
    </Koronalenke>

    <Element className="koronaboks__tekst">Restriksjoner for innreise</Element>
    <Koronalenke href={grensekompURL}>
        Søk om refusjon av for utestengte EØS-borgere
    </Koronalenke>

    <Koronalenke href={grensekompOversiktURL}>
        Refusjon for utestengte EØS-borgere - se innsendte krav
    </Koronalenke>
</>;

