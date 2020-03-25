import React from 'react';
import './Koronaboks.less';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import syfoikon from './syfoikon.svg';
import { lenkeTilPermitteringOgMasseoppsigelsesSkjema } from '../../lenker';



export const Koronaboks = () => {
    return (
        <div className={'koronaboks'}>
        <Innholdsboks classname={'koronaboks__innhold'} >
            <img className={'koronaboks__ikon'} alt='' src={syfoikon}/>
            <Undertittel> Koronavirus - permitteringer, oppsigelser eller innskrenkning i arbeidstid</Undertittel>
            <Normaltekst className={'koronaboks__tekst'}>Arbeidsgiver har meldeplikt til NAV ved masseoppsigelser, permitteringer uten lønn og innskrenknigner i arbeidstiden, dersom dette rammer mer enn 10 arbeidtakere.</Normaltekst>
            <Lenke href={lenkeTilPermitteringOgMasseoppsigelsesSkjema()}>Varsle NAV gå til skjema <HoyreChevron/></Lenke>
                <Lenke href={'https://arbeidsgiver.nav.no/permittering/'}>Informasjon til arbeidsgivere <HoyreChevron/></Lenke>
        </Innholdsboks>
        </div>
    );
};