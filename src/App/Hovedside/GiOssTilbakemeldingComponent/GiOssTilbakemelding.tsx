import React, { useState } from 'react';
import './GiOssTilbakemelding.less';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { møteBookingLenke } from '../../../lenker';


export const GiOssTilbakemelding = () => {
    const dato = new Date();

    const hentLukketStatusFraLocalStorage = (): boolean => {
        const lukketFraLocalstorage = window.localStorage.getItem('GiOssTilbakemeldingLukket');
        return lukketFraLocalstorage != null;
    };
    const [erLukketTidligere, setErLukketTidligere] = useState(hentLukketStatusFraLocalStorage());

    const lukkOgSkrivTilLocalstorage = () => {
        window.localStorage.setItem('GiOssTilbakemeldingLukket', dato.toDateString());
        setErLukketTidligere(true);
    };

    if (!erLukketTidligere) {
        return (
            <span className={'tilbakemelding-banner'}>
        <Panel border
               className={'panel'}>
            <div className={'innhold'}>
                <Normaltekst> Vi som lager siden vil gjerne høre om dine erfaringer som arbeidsgiver.<LenkeMedLogging
                    loggLenketekst={'Møtebooking'} className={'mote-lenke'} href={møteBookingLenke}>Avtal et digitalt møte med oss. </LenkeMedLogging> </Normaltekst>
                <Lukknapp className={'lukk-knapp'} onClick={lukkOgSkrivTilLocalstorage}>Lukk</Lukknapp>
                </div>

        </Panel>
</span>
        );
    }
    return <></>;
};
