import React, { useContext } from 'react';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import Element from 'nav-frontend-typografi/lib/element';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import sirkel from './report-problem-circle.svg';
import {
    lenkeTilPermitteringOgMasseoppsigelsesSkjema,
    lenkeTilLonnskompensasjonRefusjonSkjema,
    lenkeTilKlageskjema, LenkeTilKoronaSykeRefusjon
} from '../../lenker';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import './Koronaboks.less';

export const Koronaboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);

    let harTilgangRefusjon = listeMedSkjemaOgTilganger.filter(tjeneste =>
        tjeneste.Skjema.navn === 'Inntektsmelding' && tjeneste.OrganisasjonerMedTilgang.filter(org =>
            org.OrganizationNumber === valgtOrganisasjon.OrganizationNumber).length >0
    ).length > 0 ;

    return (
        <div className="koronaboks">
            <Innholdsboks classname="koronaboks__innhold">
                <img className="koronaboks__ikon" alt="" src={sirkel} />
                <Undertittel>Koronarelaterte tjenester</Undertittel>

                <Element className="koronaboks__tekst">Permittering</Element>

                <Lenke
                    className="koronaboks__lenke"
                    href={lenkeTilPermitteringOgMasseoppsigelsesSkjema()}
                >
                    <span>
                        Varsle NAV om permitteringer, masseoppsigelser eller
                        innskrenkninger i arbeidstiden
                    </span>
                    <HoyreChevron />
                </Lenke>

                {harTilgangRefusjon && (
                    <>
                        <Lenke
                            className="koronaboks__lenke"
                            href={lenkeTilLonnskompensasjonRefusjonSkjema()}
                        >
                            <span>Arbeidsgivers innmelding for lønnskompensasjon og refusjon</span>
                            <HoyreChevron />
                        </Lenke>
                        <Lenke
                            className="koronaboks__lenke"
                            href={lenkeTilKlageskjema(valgtOrganisasjon.OrganizationNumber)}
                        >
                            <span>Endring av opplysninger/klage på vedtak for refusjon av lønn ved permittering</span>
                            <HoyreChevron />
                        </Lenke>

                        <Element className="koronaboks__tekst">Refusjon sykepenger</Element>
                        <Lenke className="koronaboks__lenke" href={LenkeTilKoronaSykeRefusjon(valgtOrganisasjon.OrganizationNumber)}>
                            <span>Søk om refusjon av sykepenger relatert til koronavirus</span>
                            <HoyreChevron />
                        </Lenke>
                    </>
                )}
            </Innholdsboks>
        </div>
    );
};
