import React, { FunctionComponent, useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Element from 'nav-frontend-typografi/lib/element';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import {
    lenkeTilPermitteringOgMasseoppsigelsesSkjema,
    lenkeTilKlageskjema,
    LenkeTilKoronaSykeRefusjon,
    lenkeTilPermitteringsInfo, lenkeTilLonnskompensasjonOgRefusjon,
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
        Lønnskompensasjon og refusjon – se kvittering
    </Koronalenke>

    <Koronalenke href={lenkeTilKlageskjema(orgnr)}>
        Endring av opplysninger/klage på vedtak for refusjon av lønn ved
        permittering
    </Koronalenke>

    <Element className="koronaboks__tekst">Refusjon sykepenger</Element>
    <Koronalenke href={LenkeTilKoronaSykeRefusjon(orgnr)}>
        Søk om refusjon av sykepenger relatert til koronavirus
    </Koronalenke>
</>;

