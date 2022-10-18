import React from "react";
import arbeidsforholdikon from "./arbeidsforholdikon.svg";
import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";

const ArbeidsforholdBoksPlaceHolder = () => {

    return (


    <div className="tjenesteboks-innhold">
        <TjenesteBoksBanner tittel={"Arbeidsforhold"} imgsource={arbeidsforholdikon} altTekst=""/>
        <div
            className={"tjenesteboks__lenkepanel"}
            style={{display:"flex"}}
        >
            <div style={{margin:"auto", padding:"0 1rem"}}>
                Denne tjenesten er utilgjengelig på grunn av vedlikehold. Vi forventer å være tilbake med denne tjenesten innen få minutter. Prøv igjen senere.
            </div>
        </div>
    </div>
    )
}

export default ArbeidsforholdBoksPlaceHolder