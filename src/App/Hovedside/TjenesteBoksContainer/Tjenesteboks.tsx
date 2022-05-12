import React, {FC} from 'react';
import TjenesteBoksBanner from "./TjenesteBoksBanner/TjenesteBoksBanner";
import {LenkepanelMedLogging} from "../../../GeneriskeElementer/LenkepanelMedLogging";

interface Props{
    ikon: string;
    href: string;
    tittel: string;
    "aria-label": string;
}

export const Tjenesteboks:FC<Props> = (props) =>
    <div className="tjenesteboks-innhold">
        <TjenesteBoksBanner tittel={props.tittel} imgsource={props.ikon} altTekst=""/>
        <LenkepanelMedLogging
            loggLenketekst={props.tittel}
            href={props.href}
            tittelProps="normaltekst"
            aria-label={props["aria-label"]}
        >
            <div style={{paddingRight:"2rem"}}>{props.children}</div>

        </LenkepanelMedLogging>
    </div>;