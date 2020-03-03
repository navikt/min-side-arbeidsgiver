import React, { FunctionComponent } from 'react';
import "./TjenesteInfo.less";

import {Element} from "nav-frontend-typografi";


interface Props {

}

const TjenesteInfo: FunctionComponent<Props> = props => {
    return (
        <div className={'tjeneste-info'}>
            <Element>Rekruttering</Element>
        </div>
    );
};

export default TjenesteInfo;