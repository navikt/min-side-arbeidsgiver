import {Undertittel} from "nav-frontend-typografi";
import "./TittelMedIkon.less"
import React, {FC} from "react";

export type Props = {
    tittel: string
    ikon: string

}
export const TittelMedIkon: FC<Props> = (props) =>
    <div className={"tittel-med-ikon"}>
        <img className={"tittel-med-ikon__ikon"} src={props.ikon} alt=""/>
        <Undertittel>
            {props.tittel}
        </Undertittel>
    </div>



