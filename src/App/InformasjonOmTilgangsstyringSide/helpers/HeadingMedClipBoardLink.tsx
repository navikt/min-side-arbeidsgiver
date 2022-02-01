import React, {FunctionComponent} from 'react';
import {Heading} from '@navikt/ds-react';
import "@navikt/ds-css";
import {ClipBoardLink} from "./ClipBoardLink";

interface HeadingMedClipBoardLinkProps {
    id: string;
    title: string;
    level?: "1" | "2" | "3" | "4" | "5" | "6";
}

export const HeadingMedClipBoardLink: FunctionComponent<HeadingMedClipBoardLinkProps> = ({id, title, level}) => {
    return <>
        <Heading id={id} size='large' level={level} spacing>
            {title}
        </Heading>
        <ClipBoardLink hash={id}/>
    </>
}
