import { FunctionComponent, MouseEventHandler, ReactNode } from 'react';
import {BodyShort, Link as DsLink, LinkProps } from '@navikt/ds-react';
import {loggNavigasjon} from '../utils/funksjonerForAmplitudeLogging';
import { useLocation, Link as ReactLink } from 'react-router-dom';

export interface Props extends LinkProps {
    href: string;
    loggLenketekst: string;
    children: ReactNode;
}

export const LenkeMedLogging: FunctionComponent<Props> = props => {
    const {onClick, loggLenketekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(props.href, loggLenketekst, pathname);
        onClick?.(event);
    };
    return <BodyShort as={"span"}> <DsLink onClick={onClickLog} {...rest}/> </BodyShort>
};

export const InternLenkeMedLogging: FunctionComponent<Props> = ({onClick, loggLenketekst, href, children}) => {
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(href, loggLenketekst, pathname);
        onClick?.(event);
    };
    return <BodyShort as={"span"}> <DsLink as={ReactLink} onClick={onClickLog} to={href}>{children}</DsLink></BodyShort>
};
