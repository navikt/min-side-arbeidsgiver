import React, {useContext} from 'react';
import './Koronaboks.less';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import Element from 'nav-frontend-typografi/lib/element';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import sirkel from './report-problem-circle.svg';
import {LenkeTilKoronaRefusjon, lenkeTilPermitteringOgMasseoppsigelsesSkjema} from '../../lenker';
import {Undertittel} from "nav-frontend-typografi";
import {OrganisasjonsDetaljerContext} from "../../OrganisasjonDetaljerProvider";

export const Koronaboks = () => {
    const { tilgangsArray } = useContext(OrganisasjonsDetaljerContext);
    return (
        <div className={'koronaboks'}>
        <Innholdsboks classname={'koronaboks__innhold'} >
            <img className={'koronaboks__ikon'} alt='' src={sirkel}/>
            <Undertittel >Koronarelaterte tjenester</Undertittel>
            <Element className={'koronaboks__tekst'}> Permittering </Element>
            <Lenke className={'koronaboks__lenke'} href={lenkeTilPermitteringOgMasseoppsigelsesSkjema()}>Varsle NAV om permitteringer, masseoppsigelser, permitteringer eller innskrenknigner i arbeidstiden <HoyreChevron/></Lenke>
            <Lenke className={'koronaboks__lenke'} href={"https://www.nav.no/person/kontakt-oss/chat/arbeidsgiver"}>Chat med NAV om permittering <HoyreChevron/></Lenke>
            <Element className={'koronaboks__tekst'}> Refusjon </Element>
            <Lenke className={'koronaboks__lenke'} href={LenkeTilKoronaRefusjon()}>Søk om refusjon av sykepenger relatert til koronavirus <HoyreChevron/></Lenke>
        </Innholdsboks>
        </div>
    );
};