import {FunctionComponent, MouseEventHandler} from 'react';
import {loggNavigasjon} from '../utils/funksjonerForAmplitudeLogging';
import {Link, LinkProps, useLocation} from 'react-router-dom';
import {BodyShort} from "@navikt/ds-react";

export interface Props extends LinkProps {
    loggLenketekst: string;
}

export const LinkMedLogging: FunctionComponent<Props> = props => {
    const {onClick, loggLenketekst, ...rest} = props;
    const {pathname} = useLocation()

    const href = typeof props.to === "string" ? props.to : props.to.pathname ?? ".";

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        window.scrollTo(0, 0);
        loggNavigasjon(href, loggLenketekst, pathname);
        onClick?.(event);
    };

    return <BodyShort><Link onClick={onClickLog} {...rest} /></BodyShort>;
};