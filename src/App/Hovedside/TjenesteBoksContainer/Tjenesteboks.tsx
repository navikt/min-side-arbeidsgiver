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
            aria-label={props["aria-label"]}
            border={false}
            className={"tjenesteboks__lenkepanel"}
        >
            {props.children}
        </LenkepanelMedLogging>
    </div>;


export const StortTall:FC = (props) => {
    return <span className={"tjenesteboks__storttall"}>
        {props.children}
    </span>
}