import React, { FunctionComponent } from 'react';
import './IkkeTilgangTilDisseTjenestene.less';

import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import TjenesteInfo from "./TjenesteInfo/TjenesteInfo";


interface Props {

}

const IkkeTilgangTilDisseTjenestene: FunctionComponent<Props> = props => {
    return (
        <Ekspanderbartpanel className={"oversikt-over-manglende-tilganger"} tittel="Tjenester du ikke har tilgang til">
            <div className={"oversikt-over-manglende-tilganger__container"}>
            <TjenesteInfo/>
            <TjenesteInfo/>
            </div>
        </Ekspanderbartpanel>
);
};

export default IkkeTilgangTilDisseTjenestene;
