import React from 'react';
import './Koronaboks.less';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import syfoikon from './syfoikon.svg';



export const Koronaboks = () => {
    return (
        <div className={'koronaboks'}>
        <Innholdsboks classname={'koronaboks__innhold'} >
            <img className={'koronaboks__ikon'} alt='' src={syfoikon}/>
            <Undertittel> Koronavirus - permitteringer, oppsigelser eller innskrenkning i arbeidstid</Undertittel>
            <Normaltekst className={'korona__tekst'}>Arbeidsgiver har meldeplikt til NAV ved masseoppsigelser, permitteringer uten lønn og innskrenknigner i arbeidstiden, derom dette rammer mer enn 10 arbeidtakere.</Normaltekst>
            <Lenke href={'https://arbeidsgiver.nav.no/permittering/'}>Varsle NAV gå til skjema <HoyreChevron/></Lenke>
                <Lenke href={'https://arbeidsgiver.nav.no/permittering/'}>Informasjon til arbeidsgivere <HoyreChevron/></Lenke>
                <Lenke href={'https://arbeidsgiver.nav.no/permittering/'}>Lenke 3 <HoyreChevron/></Lenke>

        </Innholdsboks>
        </div>
    );
};
