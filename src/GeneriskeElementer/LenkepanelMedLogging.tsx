import {MouseEventHandler} from 'react';
import {loggNavigasjon} from '../utils/analytics';
import {Link, LinkProps, useLocation} from 'react-router-dom';
import {LinkPanel, LinkPanelProps} from "@navikt/ds-react";

interface Props extends LinkPanelProps{
    loggLenketekst: string;
}

export const LenkepanelMedLogging= (props: Props) => {
    const {onClick, loggLenketekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(props.href, loggLenketekst, pathname);
        onClick?.(event);
    };
    return <LinkPanel onClick={onClickLog} {...rest} />;
};

interface InternalProps extends LinkProps{
    loggLenketekst: string;

}
export const InternalLenkepanelMedLogging= (props: InternalProps) => {
    const {onClick, loggLenketekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(JSON.stringify(props.to), loggLenketekst, pathname);
        onClick?.(event);
    };
    return <LinkPanel as={Link} onClick={onClickLog} {...rest} />;
};