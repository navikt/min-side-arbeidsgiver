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

export const Koronaboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    return (
        <div className="koronaboks">
            <Innholdsboks classname="koronaboks__innhold">
                <KoronaboksIkon />
                <Undertittel>Koronarelaterte tjenester</Undertittel>

                <Element className="koronaboks__tekst">Permittering</Element>

                <Lenke
                    className="koronaboks__lenke"
                    href={lenkeTilPermitteringOgMasseoppsigelsesSkjema}
                >
                    <span>
                        Varsle NAV om permitteringer, masseoppsigelser eller innskrenkninger i
                        arbeidstiden
                    </span>
                    <HoyreChevron />
                </Lenke>
                <Lenke className="koronaboks__lenke" href={lenkeTilPermitteringsInfo}>
                    <span>Nye regler for lønnsplikt ved permittering</span>
                    <HoyreChevron />
                </Lenke>
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
    <Lenke className="koronaboks__lenke" href={lenkeTilLonnskompensasjonOgRefusjon}>
        <span>Lønnskompensasjon og refusjon – se kvittering</span>
        <HoyreChevron />
    </Lenke>

    <Lenke className="koronaboks__lenke" href={lenkeTilKlageskjema(orgnr)}>
        <span>
            Endring av opplysninger/klage på vedtak for refusjon av lønn ved
            permittering
        </span>
        <HoyreChevron />
    </Lenke>

    <Element className="koronaboks__tekst">Refusjon sykepenger</Element>
    <Lenke className="koronaboks__lenke" href={LenkeTilKoronaSykeRefusjon(orgnr)}>
        <span>Søk om refusjon av sykepenger relatert til koronavirus</span>
        <HoyreChevron />
    </Lenke>
</>;

