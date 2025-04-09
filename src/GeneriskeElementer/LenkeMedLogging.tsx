import { forwardRef, FunctionComponent, MouseEventHandler, ReactNode } from 'react';
import {BodyShort, Link as DsLink, LinkProps } from '@navikt/ds-react';
import {loggNavigasjon} from '../utils/analytics';
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

export const InternLenkeMedLogging = forwardRef<HTMLAnchorElement, Props>(
    ({ onClick, loggLenketekst, href, children, ...rest }, ref) => {
        const { pathname } = useLocation();

        const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
            loggNavigasjon(href, loggLenketekst, pathname);
            onClick?.(event);
        };

        return (
            <BodyShort as="span">
                <DsLink
                    as={ReactLink}
                    to={href}
                    onClick={onClickLog}
                    ref={ref}
                    {...rest}
                >
                    {children}
                </DsLink>
            </BodyShort>
        );
    }
);