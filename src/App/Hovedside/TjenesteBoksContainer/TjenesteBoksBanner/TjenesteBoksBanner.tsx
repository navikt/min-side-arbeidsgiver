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
    toolTipext?:FunctionComponent;
}

const tooltip: FunctionComponent<Props> = props => {
  console.log("tooltip props",props);
    return (
        <div>
            <ReactTooltip id="helloworld" aria-haspopup="true">
              {props.toolTipext&&props.toolTipext(props)}
            </ReactTooltip>
        </div>
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
            {props.antallVarsler! > 0 && (
                <span className={'tjeneste-boks-banner__varselsirkel'}>
                    <Element
                        data-tip
                        data-for="helloworld"
                        className={'tjeneste-boks-banner__varsel'}
                    >
                        {props.antallVarsler}
                    </Element>
                  {tooltip(props)}
                </span>

            )}

        </div>
    );
};

export default TjenesteBoksBanner;
