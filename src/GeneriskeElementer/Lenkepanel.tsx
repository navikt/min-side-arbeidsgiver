import { Link, LinkProps } from 'react-router-dom';
import { LinkPanel, LinkPanelProps } from '@navikt/ds-react';

export const Lenkepanel = (props: LinkPanelProps) => <LinkPanel {...props} />;

export const InternalLenkepanel = (props: LinkProps) => <LinkPanel as={Link} {...props} />;
