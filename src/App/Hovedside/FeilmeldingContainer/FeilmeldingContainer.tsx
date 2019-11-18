import React, {FunctionComponent} from "react";
import AlertStripe from "nav-frontend-alertstriper";
import './FeilmeldingContainer.less'
interface Props {
    visFeilmelding: boolean;
}

export const FeilmeldingContainer:FunctionComponent<Props> = (props)=>{
    return (<>
        {props.visFeilmelding &&(
            <AlertStripe type={"feil"} className={"FeilStripe"}>Vi opplever ustabilitet med Altinn. Hvis du mener at du har roller i Altinn kan du prøve å <a href={"https://arbeidsgiver.nav.no/min-side-arbeidsgiver/"}>laste siden på nytt</a></AlertStripe>
        )}
    </>)
};