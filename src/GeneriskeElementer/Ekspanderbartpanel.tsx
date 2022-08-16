import { Button, Heading, Panel } from '@navikt/ds-react';
import { Collapse as CollapseIcon, Expand as ExpandIcon } from '@navikt/ds-icons';
import React, { FC, ReactNode, useState } from 'react';
import { Collapse } from 'react-collapse';

import "./Ekspanderbartpanel.less";

export type Props = {
    className?: string;
    tittel: ReactNode;
    apen?: boolean;
}

export const Ekspanderbartpanel: FC<Props> = ({className, children, tittel}) => {
    const [showing, setShowing] = useState(false)

    return <Panel border className="ekspanderbartpanel">
        <Button
            variant="tertiary"
            className="ekspanderbartpanel__button"
            onClick={() => setShowing(!showing)}
            aria-expanded={showing}
        >
            <Heading size="small" as="span"> {tittel} </Heading>
            { showing ? <CollapseIcon /> : <ExpandIcon /> }
        </Button>

        <Collapse isOpened={showing}>
            <div className={`ekspanderbartpanel__content ${className}`}>
                { children }
            </div>
        </Collapse>
    </Panel>
}