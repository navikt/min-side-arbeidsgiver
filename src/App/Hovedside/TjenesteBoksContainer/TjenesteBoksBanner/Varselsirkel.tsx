import React, { FunctionComponent } from 'react';
import ReactTooltip from 'react-tooltip';
import { Element } from 'nav-frontend-typografi';
import './Varselsirkel.less';

interface VarselProps {
    antallVarsler?: number;
    toolTipText?: FunctionComponent;
    VisOppgaveFeilmelding?: boolean;
}

const tooltip: FunctionComponent<VarselProps> = props => {
    return (
        <div>
            <ReactTooltip id="tooltip" aria-haspopup="true">
                {props.toolTipText && props.toolTipText(props)}
            </ReactTooltip>
        </div>
    );
};

const Varselsirkel: FunctionComponent<VarselProps> = props => {
    return (
        <>
            {props.antallVarsler! > 0 && (
                <span className="tjeneste-boks-banner__varselsirkel">
                    <Element data-tip data-for="tooltip" className="varseltekst">
                        {props.antallVarsler}
                    </Element>
                    {tooltip(props)}
                </span>
            )}
            {props.VisOppgaveFeilmelding && (
                <span className="tjeneste-boks-banner__feil">
                    <Element data-tip data-for="tooltip" className="varseltekst">
                        !
                    </Element>
                    {tooltip(props)}
                </span>
            )}
        </>
    );
};

export default Varselsirkel;