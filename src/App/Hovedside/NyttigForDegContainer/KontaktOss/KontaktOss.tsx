import React from 'react';
import iconKontaktNav from './kontaktossikon.svg';
import './KontaktOss.less';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import {TittelMedIkon} from "../../../../GeneriskeElementer/TittelMedIkon";

const KontaktOss = () =>
        <LenkepanelMedLogging
            className="kontakt-oss"
            href="https://arbeidsgiver.nav.no/kontakt-oss/"
            loggLenketekst="kontakt oss"
            tittelProps="undertittel"
        >
            <TittelMedIkon tittel={"Kontakt NAV"} ikon={iconKontaktNav}/>
        </LenkepanelMedLogging>

export default KontaktOss;
