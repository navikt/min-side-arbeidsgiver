import React from 'react';
import { lenkeTilSykefravarsstatistikk } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import IAwebikon from './IawebIkon.svg';
import './IAwebboks.less';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';


const IAwebboks = () => {
    const valgtbedrift = () => {
        const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
        return orgnummerFraUrl === '' ? '' : `?bedrift=${orgnummerFraUrl}`;
    };

    return (
        <div className="IA-web-boks tjenesteboks-innhold">
            <TjenesteBoksBanner tittel="Sykefraværsstatistikk" imgsource={IAwebikon} altTekst="" />
            <LenkepanelMedLogging
                className="IA-web-boks__info"
                href={lenkeTilSykefravarsstatistikk + valgtbedrift()}
                tittelProps="normaltekst"
                loggLenketekst="Sykefraværsstatistikk"
            >
                <div className="IA-web-boks__tekst">
                    Har du høyere eller lavere sykefravær sammenlignet med din bransje? Se tallene
                    og tips om hvordan du kan påvirke sykefraværet ditt
                </div>
            </LenkepanelMedLogging>
        </div>
    );
};

export default IAwebboks;
