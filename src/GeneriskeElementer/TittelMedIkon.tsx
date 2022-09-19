import "./TittelMedIkon.css"
import React, {FC} from "react";
import {Heading} from "@navikt/ds-react";

export type Props = {
    tittel: string
    ikon: string

}
export const TittelMedIkon: FC<Props> = (props) =>
    <div className={"tittel-med-ikon"}>
        <div className={"tittel-med-ikon-container"}>
        <img className={"tittel-med-ikon__ikon"} src={props.ikon} alt=""/>
        </div>
        <Heading size="small" level="2">
            {props.tittel}
        </Heading>
    </div>



