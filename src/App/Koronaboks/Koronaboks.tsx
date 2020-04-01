import React, {useContext, useEffect, useState} from 'react';
import './Koronaboks.less';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import Element from 'nav-frontend-typografi/lib/element';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import sirkel from './report-problem-circle.svg';
import {LenkeTilKoronaRefusjon, lenkeTilPermitteringOgMasseoppsigelsesSkjema} from '../../lenker';
import {Undertittel} from "nav-frontend-typografi";
import {OrganisasjonsDetaljerContext} from "../../OrganisasjonDetaljerProvider";
import {OrganisasjonsListeContext} from "../../OrganisasjonsListeProvider";
import {SkjemaMedOrganisasjonerMedTilgang} from "../../api/dnaApi";
import {Feature, FeatureToggleContext} from "../../FeatureToggleProvider";

export const Koronaboks = () => {
    const { valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);
    const [tilgangRefusjon, setTilgangRefusjon] = useState(false);
    const featureToggleContext = useContext(FeatureToggleContext);
    const visRefusjon = featureToggleContext[Feature.visRefusjon];
    useEffect(() => {
        const sjekkOgSettTilgang = (
            skjema: SkjemaMedOrganisasjonerMedTilgang,
            skjemaNavn: string,
            orgnrMedTilgang: string[]
        ): number => {
            if (orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber) && skjema.Skjema.navn !== 'Tiltaksgjennomforing') {
                setTilgangRefusjon( true);
                return 1;
            }
            if (!orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)) {
                setTilgangRefusjon( false);
            }
            return 0;
        };

        const finnTilgang = () => {
            listeMedSkjemaOgTilganger.forEach(skjema => {
                let orgnrMedTilgangTilSkjema: string[] = skjema.OrganisasjonerMedTilgang.map(
                    org => org.OrganizationNumber
                );
               sjekkOgSettTilgang(
                    skjema,
                    skjema.Skjema.navn,
                    orgnrMedTilgangTilSkjema
                );
            });
        };
        if (listeMedSkjemaOgTilganger.length === 6) {
            finnTilgang();
        }
        finnTilgang();
    }, [valgtOrganisasjon, listeMedSkjemaOgTilganger]);


    return (
        <div className={'koronaboks'}>
        <Innholdsboks classname={'koronaboks__innhold'} >
            <img className={'koronaboks__ikon'} alt='' src={sirkel}/>
            <Undertittel >Koronarelaterte tjenester</Undertittel>
            <Element className={'koronaboks__tekst'}> Permittering </Element>
            <Lenke className={'koronaboks__lenke'} href={lenkeTilPermitteringOgMasseoppsigelsesSkjema()}>Varsle NAV om permitteringer, masseoppsigelser, permitteringer eller innskrenknigner i arbeidstiden <HoyreChevron/></Lenke>
            <Lenke className={'koronaboks__lenke'} href={"https://www.nav.no/person/kontakt-oss/chat/arbeidsgiver"}>Chat med NAV om permittering <HoyreChevron/></Lenke>
            {tilgangRefusjon &&
                <div>
                <Element className={'koronaboks__tekst'}> Refusjon </Element>
                < Lenke className={'koronaboks__lenke'} href={LenkeTilKoronaRefusjon()}>Søk om refusjon av sykepenger relatert til koronavirus <HoyreChevron/></Lenke>
                </div>
            }
        </Innholdsboks>
        </div>
    );
};