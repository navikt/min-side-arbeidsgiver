import React, { useContext } from 'react';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import Element from 'nav-frontend-typografi/lib/element';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import sirkel from './report-problem-circle.svg';
import {
    lenkeTilPermitteringOgMasseoppsigelsesSkjema,
    lenkeTilKlageskjema,
    LenkeTilKoronaSykeRefusjon, lenkeTilPermitteringsInfo
} from "../../lenker";
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import './Koronaboks.less';

export const Koronaboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const harTilgangRefusjon =
        valgtOrganisasjon && valgtOrganisasjon.altinntilgang.inntektsmelding;
    const orgnr = valgtOrganisasjon?.organisasjon.OrganizationNumber;

    return (
        <div className="koronaboks">
            <Innholdsboks classname="koronaboks__innhold">
                <img className="koronaboks__ikon" alt="" src={sirkel} />
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
                <Lenke
                  className="koronaboks__lenke"
                  href={lenkeTilPermitteringsInfo}
                >
                    <span>
                        Nye regler for lønnsplikt ved permittering
                    </span>
                    <HoyreChevron />
                </Lenke>

                {harTilgangRefusjon && orgnr && (
                    <>
                        <Lenke
                            className="koronaboks__lenke"
                            href={lenkeTilKlageskjema(orgnr)}
                        >
                            <span>
                                Endring av opplysninger/klage på vedtak for refusjon av lønn ved
                                permittering
                            </span>
                            <HoyreChevron />
                        </Lenke>

                        <Element className="koronaboks__tekst">Refusjon sykepenger</Element>
                        <Lenke
                            className="koronaboks__lenke"
                            href={LenkeTilKoronaSykeRefusjon(orgnr)}
                        >
                            <span>Søk om refusjon av sykepenger relatert til koronavirus</span>
                            <HoyreChevron />
                        </Lenke>
                    </>
                )}
            </Innholdsboks>
        </div>
    );
};
