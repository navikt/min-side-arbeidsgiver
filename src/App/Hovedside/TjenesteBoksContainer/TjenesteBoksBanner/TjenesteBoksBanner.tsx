import React, { FunctionComponent } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Varselsirkel from './Varselsirkel';
import './TjenesteBoksBanner.less';

interface Props {
    imgsource: string;
    tittel: string;
    altTekst: string;
    antallVarsler?: number;
    toolTipText?: FunctionComponent;
    VisOppgaveFeilmelding?: boolean;
}

const TjenesteBoksBanner = (props: Props) => {
    return (
        <div className="tjeneste-boks-banner">
            <img
                className="tjeneste-boks-banner__ikon"
                src={props.imgsource}
                alt={props.altTekst}
            />
            <Undertittel className="tjeneste-boks-banner__tittel">{props.tittel}</Undertittel>
            <Varselsirkel
                antallVarsler={props.antallVarsler}
                toolTipText={props.toolTipText}
                VisOppgaveFeilmelding={props.VisOppgaveFeilmelding}
            />
        </div>
    );
};

export default TjenesteBoksBanner;
