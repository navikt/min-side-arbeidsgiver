import React, { FunctionComponent } from 'react';
import { Element, Undertittel } from 'nav-frontend-typografi';
import './TjenesteBoksBanner.less';
import ReactTooltip from 'react-tooltip';

interface Props {
    className?: string;
    imgsource: string;
    tittel: string;
    altTekst: string;
    antallVarsler?: number;
    toolTipext?: FunctionComponent;
    VisOppgaveFeilmelding?: boolean;
}
interface VarselProps {
    className?: string;
    antallVarsler?: number;
    toolTipext?: FunctionComponent;
    VisOppgaveFeilmelding?: boolean;
}

const tooltip: FunctionComponent<VarselProps> = props => {
    return (
        <div>
            <ReactTooltip id="tooltip" aria-haspopup="true">
                {props.toolTipext && props.toolTipext(props)}
            </ReactTooltip>
        </div>
    );
};

const VarselSirkel: FunctionComponent<VarselProps> = props => {
    return (
        <>
            {props.antallVarsler! > 0 && (
                <span className={'tjeneste-boks-banner__varselsirkel'}>
                    <Element data-tip data-for="tooltip" className={'tjeneste-boks-banner__varsel'}>
                        {props.antallVarsler}
                    </Element>
                    {tooltip(props)}
                </span>
            )}
            {props.VisOppgaveFeilmelding && (
                <span className={'tjeneste-boks-banner__feil'}>
                    <Element data-tip data-for="tooltip" className={'tjeneste-boks-banner__varsel'}>
                        !
                    </Element>
                    {tooltip(props)}
                </span>
            )}
        </>
    );
};

const TjenesteBoksBanner: FunctionComponent<Props> = props => {
    return (
        <div className={'tjeneste-boks-banner'}>
            <img
                className={'tjeneste-boks-banner__ikon'}
                src={props.imgsource}
                alt={props.altTekst}
            />
            <Undertittel className={'tjeneste-boks-banner__tittel'}>{props.tittel}</Undertittel>
            <VarselSirkel
                antallVarsler={props.antallVarsler}
                toolTipext={props.toolTipext}
                className={props.className}
                VisOppgaveFeilmelding={props.VisOppgaveFeilmelding}
            />
        </div>
    );
};

export default TjenesteBoksBanner;
