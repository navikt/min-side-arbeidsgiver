import React, { useState } from 'react';
import './GiOssTilbakemelding.less';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { møteBookingLenke } from '../../../lenker';


export const GiOssTilbakemelding = () => {
    const dato = new Date();

    const erMandagEllerTirsdag = (): boolean => {
        return dato.getDay() <= 2;
    };
    const hentLukketStatusFraLocalStorage = (): boolean => {
        const lukketFraLocalstorage = window.localStorage.getItem('GiOssTilbakemeldingLukket');
        return lukketFraLocalstorage != null;
    };
    const [erLukketTidligere, setErLukketTidligere] = useState(hentLukketStatusFraLocalStorage());

    const lukkOgSkrivTilLocalstorage = () => {
        window.localStorage.setItem('GiOssTilbakemeldingLukket', dato.toDateString());
        setErLukketTidligere(true);
    };

    if (!erLukketTidligere && erMandagEllerTirsdag()) {
        return (
            <span className={'tilbakemelding-banner'}>
        <Panel border
               className={'panel'}>
            <div className={'innhold'}>
                <Normaltekst> Er du arbeidsgiver og vil dele dine erfaringer med oss som lager tjenesten? <LenkeMedLogging
                    loggLenketekst={'Møtebooking'}
                    href={møteBookingLenke}>Avtal et digitalt møte med oss. </LenkeMedLogging> </Normaltekst>
                <Lukknapp className={'lukk-knapp'} onClick={lukkOgSkrivTilLocalstorage}>Lukk</Lukknapp>
                </div>
        </Panel>
</span>
        );
    }
    return <></>;
};
