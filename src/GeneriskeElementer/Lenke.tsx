import { forwardRef, FunctionComponent, ReactNode } from 'react';
import { BodyShort, Link as DsLink, LinkProps } from '@navikt/ds-react';
import { Link as ReactLink } from 'react-router-dom';

export interface Props extends LinkProps {
    href: string;
    children: ReactNode;
}

export const Lenke: FunctionComponent<Props> = (props) => {
    return <BodyShort as="span"><DsLink {...props} /></BodyShort>;
};

export const InternLenke = forwardRef<HTMLAnchorElement, Props>(
    ({ href, children, ...rest }, ref) => (
        <BodyShort as="span">
            <DsLink as={ReactLink} to={href} ref={ref} {...rest}>
                {children}
            </DsLink>
        </BodyShort>
    )
);
